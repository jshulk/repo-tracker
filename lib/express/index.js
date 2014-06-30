var express = require("express"),
    http = require("http"),
    cons = require("consolidate"),
    bodyParser = require("body-parser"),
    db = require("../db"),
    config = require("../configuration"),
    heartbeat = require("../routes/heartbeat"),
    middleware = require("../middleware"),
    morgan = require("morgan"),
    SocketHandler = require("../socket/handler"),
    routes = require("../routes"),
    gitHubAuth = require("../github/authentication"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    MemoryStore = session.MemoryStore,
    app = express();

app.use(cookieParser(config.get("session:secret")));
var sessionStore = new MemoryStore();

app.use( session({
    store: sessionStore,
    secret: config.get('session:secret'),
    cookie: { 
        secure: config.get('session:secure'),
        httpOnly: config.get('session:httpOnly'),
        maxAge: config.get('session:maxAge')
    }
    
}));

app.use(gitHubAuth.passport.initialize());
app.use(gitHubAuth.passport.session());


app.use(bodyParser());
app.set("port", config.get("express:port") );
app.use(morgan("dev"));



app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.static('public/components'));
app.use('/bootstrap', express.static('public/components/bootstrap/docs/assets/css'));
app.use('/sockets', express.static('public/components/socket.io-client/'));
app.param('id', middleware.id.validate);
app.all('*', middleware.projectForm.addToken);

app.get("/", routes.home.index);
app.get("/heartbeat", routes.heartbeat.index );
app.post("/project", routes.project.post);
app.get('/project/:id', routes.project.get);
app.put('/project/:id', routes.project.put);
app.del('/project/:id', routes.project.del);
app.get("/project", routes.project.all);
app.get("/project/:id/repos", routes.github.repos);
app.get("/project/:id/commits", routes.github.commits);
app.get("/project/:id/issues", routes.github.issues);
app.get("/auth/github", gitHubAuth.passport.authenticate('github'), routes.auth.login );
app.get('/auth/github/callback', gitHubAuth.passport.authenticate('github', {failureRedirect:'/'}), routes.auth.callback );
app.get('/logout', routes.auth.logout);

app.use(middleware.notFound.index);

var httpServer = http.createServer(app).listen(app.get("port"), function(){
   	console.log("listening on port "+ app.get("port")); 
});

var socketHandler = new SocketHandler(httpServer);

module.exports = app;