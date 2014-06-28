var express = require("express"),
    http = require("http"),
    cons = require("consolidate"),
    bodyParser = require("body-parser"),
    db = require("../db"),
    project = require("../routes/project"),
    github = require("../routes/github"),
    config = require("../configuration"),
    heartbeat = require("../routes/heartbeat"),
    notFound = require("../middleware/notFound"),
    morgan = require("morgan"),
    id = require("../middleware/id"),
    routes = require("../routes"),
    app = express();

app.use(bodyParser());
app.set("port", config.get("express:port") );
app.use(morgan("dev"));



app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.static('public/components'));
app.use('/bootstrap', express.static('public/components/bootstrap/docs/assets/css'));

app.param('id', id.validate);

app.get("/heartbeat", routes.heartbeat.index );
app.post("/project", routes.project.post);
app.get('/project/:id', routes.project.get);
app.put('/project/:id', routes.project.put);
app.del('/project/:id', routes.project.del);
app.get("/project", routes.project.all);
app.get("/project/:id/repos", routes.github.repos);
app.get("/project/:id/commits", routes.github.commits);
app.get("/project/:id/issues", routes.github.issues);
app.get("/", routes.home.index);

app.use(notFound.index);

http.createServer(app).listen(app.get("port"), function(){
   	console.log("listening on port "+ app.get("port")); 
});

module.exports = app;