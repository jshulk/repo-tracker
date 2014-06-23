var express = require("express"),
    http = require("http"),
    config = require("../configuration"),
    heartbeat = require("../routes/heartbeat"),
    notFound = require("../middleware/notFound"),
    morgan = require("morgan"),
    app = express();

app.set("port", config.get("express:port") );
app.use(morgan("dev"));

app.get("/heartbeat", heartbeat.index );

app.use(notFound.index);

http.createServer(app).listen(app.get("port"), function(){
   	console.log("listening on port "+ app.get("port")); 
});

module.exports = app;