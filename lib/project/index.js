var ProjectSchema = require("../models").model('Project'),
    _ = require("underscore"),
 	GitHubRepo = require("../github");

function Project(){}

Project.prototype.post = function( name, data, callback ){

	var query = { 'name' : name };
	var project = new ProjectSchema(data);

	ProjectSchema.findOne(query, function(error, proj){
		if( error ) return callback(error, null);
		if( proj!= null ) return callback(null, null );

		project.save(function(error, p){
			if( error ) return callback(error, null);
			return callback(null, p);
		});
	});
};

Project.prototype.get = function(id, callback){
	var query = {"_id" : id};
	ProjectSchema.findOne(query, function(error, project){
		if( error ) return callback(error, null);
		return callback(null, project);
	});
};

Project.prototype.put = function(id, update, callback){
	var query = {"_id" : id};
	delete update._id;

	ProjectSchema.findOne(query, function(error, project){
		if( error ) return callback(error, null);
		if( project == null ) return callback(null, null);

		ProjectSchema.update(query, update, function(error, project){
			if( error ) return callback(error, null);

			return callback(null, {});
		});

	});
};

Project.prototype.del = function(id, callback){
	var query = {"_id" : id};
	ProjectSchema.findOne(query, function(error, project){
		if( error ) return callback(error, null);
		if( project == null ) return callback(null, null);

		project.remove(function(error){
			if( error ) return callback(error, null );
			return callback(null, {});
		});
	});
};

Project.prototype.all = function(id, callback){
    var query = {"user" : id};
    ProjectSchema.find(query, function(error, projects){
       	if(error) return callback(error, null);
        return callback(null, projects);
    });
};

Project.prototype.repos = function(id, callback){
  
    ProjectSchema.findOne({_id : id}, function(error, project){
       
       	if( error ) return callback(error, null);
        if( project == null ) return callback(null, null);
        
        var git = new GitHubRepo(project.token, project.user);
        
        git.repositories(function(error, response){
           if( error ) return callback(error, null);
           if( response == null ) return callback(null, null);
           
            var items = response.map(function(model){
               var item = _.pick( model, ['id', 'name', 'description']);
               var enabled = _.find( project.repositories, function(repo){
                  return repo.name == item.name; 
               });
                
                (enabled)? item.enabled = 'checked' : item.enabled = '';
                
                return item;
            });
            
            return callback(null, items);
        });
    });
};

module.exports = Project;