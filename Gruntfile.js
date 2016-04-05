
module.exports = function(grunt) {


	grunt.initConfig({

		stylus: {
			compile: {
				options: {
					compress: false,
				},
				files: {
					'css/popup.css': 'ppc/popup.styl',
				}
			}
		},


		jade: {
			compile: {
				options: {
					pretty: true,
					data: {
						debug: false
					}
				},
				files: [ {
          cwd: "ppc",
          src: "*.jade",
          dest: ".",
          expand: true,
          ext: ".html"
        } ]
			}
		},

		coffee: {
			compileBare: {
				options: {
       		bare: true
       	},
       	files: {
       		'js/popup.js': 'ppc/popup.coffee',
	    	}
    	}
		},

		uglify: {
			options: {
	      mangle: false
	    },
			js: {
				files: {
					'js/popup.min.js': 'js/popup.js',
				}
			}
		},



		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln("\n>> Waiting for more changes... >>\n");
				},
			},


			stylus: {

				files: [
					'ppc/*.styl',
				],
				tasks: ['stylus']
			},

			jade: {
				files: [
					'ppc/*.jade',
				],
				tasks: ['jade']
			},

			coffee: {
				files: [
					'ppc/*.coffee',
				],
				tasks: ['coffee','uglify:js']
			},

			livereload: {
	      // Here we watch the files the sass task will compile to
	      // These files are sent to the live reload server after sass compiles to them
	      options: { livereload: 777 },
	      files: [
		      '**/*',
		      '!**/node_modules/**'
	      ],
	    },

		},






	});


	grunt.registerTask('server', 'Start web server', function() {

		require('./server/server.js');

	});

	
	grunt.file.expand('node_modules/grunt-*/tasks').forEach(grunt.loadTasks);


	grunt.registerTask('default', ['server','coffee', 'stylus', 'jade', 'uglify', 'watch']);


};