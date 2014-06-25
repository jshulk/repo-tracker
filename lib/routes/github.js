var ProjectService = require("../project"),
    logger = require("../logger"),
    Project = new ProjectService();

exports.repos = function(req, res){
    logger.info("Request. "+ req.url );
  	
    Project.repos(req.params.id, function(error, repos){
       if( error ) return res.json(500, 'Internal server error');
       if( repos == null ) return res.json(404, "Not Found");
        
        return res.json(200, repos);
    });
};