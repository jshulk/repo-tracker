var express = require("express"),
    http = require("http"),
    bodyParser = require("body-parser"),
    db = require("../db"),
    project = require("../routes/project"),
    config = require("../configuration"),
    heartbeat = require("../routes/heartbeat"),
    notFound = require("../middleware/notFound"),
    morgan = require("morgan"),
    app = express();

app.use(bodyParser());
app.set("port", config.get("express:port") );
app.use(morgan("dev"));

app.get("/heartbeat", heartbeat.index );
app.post("/project", project.post);
app.get('/project/:id', project.get);
app.put('/project/:id', project.put);
app.del('/project/:id', project.del);

app.use(notFound.index);

http.createServer(app).listen(app.get("port"), function(){
   	console.log("listening on port "+ app.get("port")); 
});

module.exports = app;