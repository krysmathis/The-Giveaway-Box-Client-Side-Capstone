module.exports = function(grunt) {
    
      // Project configuration.
      grunt.initConfig({
          pkg: grunt.file.readJSON("package.json"),
          eslint: {
              src: ["!node_modules/**/*.js","../app/*.js","../app/**/*.js","../app/**/**/*.js","../app/**/**/**/*.js"]
          },
          watch: {
              options: {
                  livereload: true
              },
              styles: {
                  files: ["../styles/**/*.css","../*.css","../sass/*.scss"]
              },
              html: {
                  files: ["index.html"]
              },
              scripts: {
                  files: ["../app/*.js","../app/**/*.js","../app/**/**/*.js"],
                  tasks: ["eslint","notify_hooks"],
                  options: {
                      spawn: false,
                  },
              }
          },
          sass: {
            dist: {
                files: {
                    "../styles/main.css": "../sass/main.scss"
                }
            }
          },
          notify_hooks: {
              options: {
                  enabled: true,
                  max_jshint_notifications: 5, // maximum number of notifications from jshint output 
                  title: "Project Name", // defaults to the name in package.json, or will use project directorys name 
                  success: false, // whether successful grunt executions should be notified automatically 
                  duration: 3 // the duration of notification in seconds, for `notify-send only 
              }
          }
      });
      
      // Load the plugin that provides the "uglify" task.
      // grunt.loadNpmTasks("grunt-contrib-uglify");
      grunt.loadNpmTasks("grunt-contrib-watch");
      grunt.loadNpmTasks("gruntify-eslint");
      // grunt.loadNpmTasks("grunt-browserify");
      grunt.loadNpmTasks("grunt-notify");
      grunt.loadNpmTasks("grunt-contrib-sass");
          
      
      // Default task(s).
      grunt.registerTask("default", ["watch","eslint","sass","notify_hooks"]);
      
  };    
  