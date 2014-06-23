var app = require("../app"),
    mongoose = require("mongoose"),
    assert = require("assert"),
    request = require("supertest"),
    login = require("./login");

describe("vision project api", function(){
   	var id;
    
    beforeEach(function(done){
       	 mongoose.connection.collections['projects'].drop(function(err){
            
             var proj = {
                 name : "test name",
                 user: login.user,
                 token : login.token,
                 repositories: ["node-plates"]
             };
         });
        
        mongoose.connection.collections['projects'].insert(proj, function(err, docs){
           	id = docs[0].id;
            done();
        });
    });
    
    
    describe("when creating a new resource /project", function(){
        var project = {
            name : "New Project",
            user : login.user,
            token : login.token,
            repositories: ["12345", "9898"]
        };
        
        it("should respond with 201", function(done){
           request(app)
           .post(project)
           .expect("Content-Type", /json/)
           .expect(201)
           .end(function(err, res){
              	var proj = JSON.parse(res.text);
               assert.equal(proj.name, project.name);
               assert.equal()
           });
        });
    });
});