module.exports =function(grunt){
    
    grunt.loadNpmTasks('grunt-cafe-mocha');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-cucumber');
    
    
    grunt.initConfig({
        env: {
            test: { NODE_ENV: "TEST" }
        },
        cafemocha: {
            test: {
                src: 'test/*.js',
                options: {
                    ui: 'bdd',
                    reporter: 'spec'
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "visiontemplates"
                },
                files: {
                    "public/components/vision/templates.js": ["templates/*.hbs"]
                }
            }
        },
        cucumberjs: {
            files: 'features',
            options: {
                steps: "features/step_definitions", 
                format: "pretty"
            }
        }
    });
    
    
    grunt.registerTask('test', ['env:test', 'cafemocha:test']);
};