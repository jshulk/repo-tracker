var ProjectSchema = require("../models").model('Project');

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

module.exports = Project;