var async = require('async'),
	_ = require("underscore"),
	util = require("util"),
	db = require("../db"),
	Publisher = require("../cache/publisher"),
	GithubRepo = require("../github"),
	Project = require("../models").model("Project");

util.inherits(Populate, Publisher );

function Populate(){
	Publisher.apply(this, arguments);
}

Populate.prototype.run = function( callback ){
	var self = this;

	Project.find({}, function(error, projects){
		if( error ) callback();
		if( projects == null ) callback();

		async.each( projects, function(project, callback){

			var git = new GithubRepo( project.token, project.user );

			git.commits( project.repositories, function(error, commits){
				if( error || !commits ) callback();

				self.save('commits:'+project._id, commits );
				self.publish('commits', { projectId : project._id, commits: commits});

				git.issues(project.repositories, function(error, issues){
					if( error || !issues ) callback();

					self.save('issues'+project._id, issues );
					self.publish('issues', { projectId: project._id, issues: issues });
				});
			});
			callback(error);
		}, function(error){
			callback(error);
		});
	});
};

module.exports = Populate;