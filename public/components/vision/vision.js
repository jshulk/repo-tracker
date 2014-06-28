var Vision = Vision || {};

Backbone.View.prototype.event_aggregator = _.extend({}, Backbone.Events);

Vision.Project = Backbone.Model.extend({
    defaults: {
        id : '',
        name : ''
    },
    idAttribute: "_id",
    urlRoot: "/project",
    validate: function(attrs){
        var errors = [];
        if( attrs.name == "" ) errors.push("Please enter a name");
        if( errors.length > 0 ) return errors;
    }
});

Vision.Commit = Backbone.Model.extend({
    defaults: {
        date: "",
        ago: "",
        message: "",
        login: "",
        avatar_url: ""
    } 
});

Vision.Repository = Backbone.Model.extend({
    defaults: {
        id : "",
        name : "",
        description: "",
        enabled: ""
    } 
});

Vision.Issue = Backbone.Model.extend({
    defaults: {
        title: "",
        state: "",
        date: "",
        ago: "",
        login: "",
        avatar_url: ""
    } 
});

Vision.IssueList = Backbone.Collection.extend({
    projectId: "",
    model: Vision.Issue,
    url: function(){
        return "/project/"+ this.projectId+"/issues";
    },
    initialize: function(items, item){
        this.projectId = item.projectId;
    },
    parse: function(response){
        response.id = response._id;
        return response;
    }
});

Vision.CommitList = Backbone.Collection.extend({
    projectId: "",
    model: Vision.Commit,
    url: function(){
        return '/project/'+ this.projectId + '/commits';
    },
    initialize: function(items, item){
        this.projectId = item.projectId;
        
    },
    parse: function(response){
        response.id = response._id;
        return response;
    }
});


Vision.IssueView = Backbone.View.extend({
    tagName : "li",
    className : "media",
    viewTemplate: visiontemplates['templates/issues.hbs'],
    render: function(){
        this.$el.html(this.viewTemplate(this.model.toJSON() ));
        return this;
    }
});

Vision.IssueListView = Backbone.View.extend({
    Issues: [],
    initialize: function(args){
        if(!args.projectId) return ;
        this.Issues = args.issues || [];
        this.$el.html('');
        this.create(args);
        
        this.listenTo(this.collection, "sync", this.render );
        this.refresh();
    },
    create: function(args){
        this.collection = new Vision.IssueList(this.Issues, {projectId: args.projectId});
    },
    render: function(){
        this.collection.each(this.addOne, this);
    },
    addOne: function(item){
      	var issueView = new Vision.IssueView({
            model: item
        });
        this.$el.append( issueView.render().el );
    },
    refresh: function(){
        var self = this;
        if(!this.Issues.length )
            this.collection.fetch();
    }
})

Vision.RepositoryList = Backbone.Collection.extend({
    model : Vision.Repository,
    projectId: "",
    url: function(){
        return "/project/"+ this.projectId + "/repos";
    },
    initialize: function(items, item){
        this.projectId = item.projectId;
    },
    parse: function(response){
        response.id = response._id;
        return response;
    }
});

Vision.CommitView = Backbone.View.extend({
    tagName : "li",
    className : "media",
    viewTemplate: visiontemplates["templates/commits.hbs"],
    render: function(){
        this.$el.html( this.viewTemplate( this.model.toJSON() ));
        return this;
    }
});

Vision.CommitListView = Backbone.View.extend({
    Commits: [],
    initialize: function(args){
        if(!args.projectId) return;
        this.Commits = args.Commits || [];
        this.$el.html('');
        this.create(args);
        
        this.listenTo(this.collection, "sync", this.render);
        this.refresh();
    },
    refresh: function(){
        var self = this;
        if(!this.Commits.length ){
            this.collection.fetch();
        }
            
    },
    render: function(){
        this.collection.each( this.addOne, this);
    },
    addOne: function(item){
        var commitView = new Vision.CommitView({ model: item});
        this.$el.append( commitView.render().el);
    },
    create: function(args){
        this.collection = new Vision.CommitList(this.Commits, {
            projectId: args.projectId 
        });
    }
});

Vision.RepositoryView = Backbone.View.extend({
    tagName : "li",
    viewTemplate: visiontemplates["templates/repositories.hbs"],
    render: function(){
        this.$el.html( this.viewTemplate(this.model.toJSON() ));
        return this;
    }
});

Vision.RepositoryListView = Backbone.View.extend({
    Repositories: [],
    initialize: function(args){
        
        this.options = args;
        
        if(!args.projectId) return;
        
        this.collection = new Vision.RepositoryList(this.Repositories, {
         projectId : args.projectId 
        });
        var self = this;
        this.$el.html("");
        
        this.listenTo( this.collection, "sync", this.render );
        
        
        
        
        this.collection.fetch();
        
    },
    render: function(){
        
      	this.collection.each( this.addOne, this ); 
        
        ( this.options.editMode ) ? this.enableForm() : this.disableForm();
        
        return this;
        
    },
    addOne: function( repository ){
        var repositoryView = new RepositoryView({
            model: repository
        });
        
        this.$el.append( repositoryView.render().el );
        
    },
    enableForm: function(){
        this.$("input:checkbox").remove('disabled');
    },
    disableForm: function(){
        this.$("input:checkbox").attr("disabled", "disabled");
    }
});


Vision.ProjectList = Backbone.Collection.extend({
    model: Vision.Project,
    url: function(){
        return "/project/";
    },
    initialize: function(){
        this.fetch();
    }
});


Vision.ProjectView = Backbone.View.extend({
    tagName : "li",
    viewTemplate: visiontemplates["templates/project.hbs"],
    formTemplate: visiontemplates["templates/project-form.hbs"],
    events: {
        "click a": "repository",
        "click button.save": "save",
        "click button.cancel": "cancel",
        "click button.edit": "edit",
        "click button.delete": "delete"
    },
    delete: function(){
    	this.model.destroy();
    	this.remove();
    	this.repository({ editMode: false});
	},
    edit: function(){
      var model = this.model.toJSON();
        this.$el.html( this.formTemplate(model));
        this.repository({ editMode: true});
    },
    add: function(){
      this.$el.html( this.formTemplate( this.model.toJSON() ));
       this.repository();
    },
    cancel: function(){
      	var projectId = this.model.toJSON()._id;
        if( this.model.isNew() ){
            this.remove();
        } else {
            this.render();
            this.repository();
        }
        
        Backbone.history.navigate('index', true);
    },
    save: function(e){
      	e.preventDefault();
        var self = this,
            formData = {};
        
        $(e.target).closest('form').find(':input').not('button').each(function(){
            formData[$(this).attr('class')] = $(this).val();
        });
        
        if( !this.model.isValid() ){
            this.formError( this.model, this.model.validationError, e);
        }
        else {
            formData.repositories = $("#repository-list").find("input:checkbox:checked")
            						.map(function(){
                                        return $(this).val();
                                    }).get();
        }
        
        this.model.save(formData, {
            error: function(model, response){
                self.formError(mode, response, e );
            },
            success: function(model, response){
                self.render();
                self.repository({editMode: false});
                Backbone.history.navigate('index', true);
            }
        });
        
    },
    formError: function(model, errors, e){
      	  $(e.target).closest('form').find('.errors').html('');
        _.each( errors, function(error){
            $(e.target).closest('form').find(".errors")
            .append('<li>'+error + '</li>');
        });
    },
    repository: function(args){
        var data = { projectId: this.model.toJSON()._id, editMode: args.editMode || false};
        this.event_aggregator.trigger("repository:join", data );
    },
    render: function(){
        var project = this.viewTemplate( this.model.toJSON());
        this.$el.html(project);
        return this;
    }
});




Vision.ProjectListView = Backbone.View.extend({
    Projects: [],
    el : "ul#projects-list",
    initialize: function(){
        this.listenTo( this.event_aggregator, "repository:join", this.repository );
        this.collection = new Vision.ProjectList(this.Projects);
        this.collection.on('add', this.add, this);
        this.collection.on('reset', this.render, this );
        this.collection.on('remove', this.remove, this);
    },
    repository: function(args){
        this.trigger("join", args);
    },
    add: function(project){
        var projectView = new Vision.ProjectView({
            model: project
        });
        
        this.$el.append(projectView.render().el);
        return projectView;
    },
    showForm: function(){
        this.add( new Vision.Project() ).add();
    },
    remove: function(removedModel){
        var removed = removeModel.attributes;
        _.each( this.Projects, function(project){
           if(_.isEqual(project, removed)){
               this.Projects.splice(_.indexOf(projects, project), 1)
           } 
        });
    }
    
});



Vision.Router = Backbone.Router.extend({
    projectListView : "",
    CommitListView: "",
    issueListView: "",
    routes: {
        "": "index",
        "add": "add"
    },
    add: function(){
      this.projectListView.showForm();  
    },
    initialize: function(){
      	this.project();  
        this.listenTo( this.projectListView, "join", this.join );
    },
    join: function(args){
        this.repository(args);
        this.commits(args);
        this.issues(args);
    },
    issues: function(args){
      this.issueListView = new Vision.IssueListView({
          el: "ul#issues-list",
          projectId: args.projectId,
          issues: args.issues
      });  
    },
    commits: function(args){
      	this.commitListView = new Vision.CommitListView({
            el: "ul#commits-list",
            projectId: args.projectId,
            commits: args.commits
        }); 
    },
    repository: function(args){
        
        this.repositoryListView = new Vision.RepositoryListView({
            el: "ul#repository-list",
            projectId: args.projectId
        });
        
    },
    project: function(){
      	this.projectListView =  new Vision.ProjectListView(); 
    },
    index: function(){
        this.projectListView.render();
    }
});


Vision.Application = function(){
    this.start = function(){
  		var router = new Vision.Router();
        Backbone.history.start();
        router.navigate('index', true);
    }
};






$(function(){
  var app = new Vision.Application();
    app.start();
});