var csurf = require("csurf"),
    helmet = require("helmet");

function Security(app){
    if(process.env['NODE_ENV'] === "TEST" || process.env["NODE_ENV"] === "COVERAGE")
        return;
    
    
    app.use(helmet.xframe());
    //app.use(helmet.hsts());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.nocache());
    app.use(csurf());
    
    
}

module.exports = Security;