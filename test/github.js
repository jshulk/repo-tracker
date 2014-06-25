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
              repositories : ["node-plates"]
          };
           
           mongoose.connection.collections['projects'].insert(proj, function(err, docs){
              
               id = docs[0]._id;
               done();
           });
           
       }); 
    });
    
    describe("when requesting a resource /project/:id/repos ", function(){
       	it("should respond with 200", function(done){
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
});