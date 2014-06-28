var app = require("../app"),
    request = require("supertest"),
    login = require("./login"),
    mongoose = require("mongoose"),
    assert = require("assert"),
    _ = require("underscore");

describe("vision github api", function(){
   	var id;
    
    beforeEach(function(done){
       mongoose.connection.collections['projects'].drop(function(err){
          
           var proj = {
              name : "test name",
              user : login.user,
              token : login.token,
              deleted: false,
              repositories : ["repo-tracker"]
          };
           
           mongoose.connection.collections['projects'].insert(proj, function(err, docs){
              
               id = docs[0]._id;
               done();
           });
           
       }); 
    });
    
    describe("when requesting a resource /project/:id/repos ", function(){
       	it("should respond with 200", function(done){
          this.timeout(5000);
           request(app)
           .get("/project/"+id+"/repos")
           .expect(200)
           .expect("Content-Type", /json/)
           .end(function(err, res){
              	var repo = _.first(JSON.parse(res.text));
               assert(_.has(repo, "id"));
               assert(_.has(repo, "name"));
               assert(_.has(repo, "description"));
               done();
           });
        }); 
    });
    
    describe("When requesting an available resource /project/:id/commits", function(){
        it("should respond with 200", function(done){
            //since we are making a network call for fetching the commits.
            this.timeout(5000);
            request(app)
            .get("/project/"+id+"/commits")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function(err, res){
              
               var commit = _.first(JSON.parse(res.text));
                assert(_.has(commit, "message"));
                assert(_.has(commit, "date"));
                assert(_.has(commit, "login"));
                assert(_.has(commit, "avatar_url"));
                assert(_.has(commit, "ago"));
                assert(_.has(commit, "repository"));
                done();
            });
        });
    });
});