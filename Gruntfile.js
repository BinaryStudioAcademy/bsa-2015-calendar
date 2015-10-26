module.exports = function(grunt) {
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		javascripts: ['frontend/javascripts/**/*.js'],
		server_js: ['backend/**/*.js'],
		views: ['frontend/views/**/*.jade'],
		templates: ['frontend/javascripts/**/*.jade'],
		stylesheets: ['frontend/styles/*.styl'],

		jshint: {
			client: ['Gruntfile.js', '<%= javascripts %>', '!frontend/javascripts/libs/**/*.js'],
			server: ['<%= server_js %>'],
			options: {
				sub: true,
				smarttabs: true,
				multistr: true,
				loopfunc: true
			}
		},
		watch: {
			options: {
				livereload: true
			},
			scripts: {
				files: ['<%= javascripts %>'],
				tasks: ['javascripts']
			},
			server_js: {
				files: ['<%= server_js %>'],
				tasks: ['jshint:server'],
				options: {
					livereload: false
				}
			},
			styles: {
				files: ['<%= stylesheets %>'],
				tasks: ['stylus']
			},
			jade_templates: {
				files: ['<%= templates %>'],
				tasks: ['jade:templates']
			},
		},
		
		karma: {
			javascript: {
				configFile: './karma.conf.js'
			}
		},

		jade: {
			templates: {
				files: [{
					expand: true,
					cwd: 'frontend/javascripts/',
					src: ['**/*.jade'],
					dest: 'public/templates/',
					ext: '.html'
				}],
			},
			views: {
				files: [{
					expand: true,
					cwd: 'frontend/views/',
					src: ['index.jade'],
					dest: 'public/',
					ext: '.html'
				}]				
			}
		},

		stylus: {
			compile: {
				options: {
					'include css': true,
					'paths': ['frontend/styles/'],
					'compress': true
				},
				files: {
					'public/styles/css/style.css': ['<%= stylesheets %>']
				}
			}
		},		

		copy: {
			libs: {files: [
					{expand: false, src: ['bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot'], dest: 'public/styles/fonts/glyphicons-halflings-regular.eot'},
					{expand: false, src: ['bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg'], dest: 'public/styles/fonts/glyphicons-halflings-regular.svg'},
					{expand: false, src: ['bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf'], dest: 'public/styles/fonts/glyphicons-halflings-regular.ttf'},
					{expand: false, src: ['bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff'], dest: 'public/styles/fonts/glyphicons-halflings-regular.woff'},
					{expand: false, src: ['bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2'], dest: 'public/styles/fonts/glyphicons-halflings-regular.woff2'},
				]				
			},
			images: {
				files: [{
					expand: true,
					cwd: 'frontend/images',
					src: ['**'],
					dest: 'public/images'
				}]
			},
			resources: {
				files: [{
					expand: true,
					cwd: 'frontend/resources',
					src: ['**'],
					dest: 'public'
				}]
			},
			js: {
				files: [{
					expand: true,
					cwd: 'frontend/javascripts/',
					src: ['**'],
					dest: 'public/javascripts/'
				}]
			}
		},

		clean: {
			templates: {
				src: ['public/templates']
			},
			public_js: {
				src: ['public/javascripts']
			},
			public_css: {
				src: ['public/css']
			},
			build: {
				src: ['build']
			}
		},

		browserify: {
			my: {
				dest: 'public/javascripts/main.js',
				src: ['frontend/javascripts/**/*.js']
			}
		},

		concat: {
			options: {
				separator: '\n'
			},
			js: {
				src: [
					'bower_components/socket.io-client/socket.io.js',					
					'bower_components/jquery/dist/jquery.min.js',
					'bower_components/bootstrap/dist/js/bootstrap.min.js',
					'bower_components/angular/angular.js',
					'bower_components/angular-animate/angular-animate.min.js',
					'bower_components/lodash/dist/lodash.min.js',
					'bower_components/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
					'bower_components/angular-ui-router/release/angular-ui-router.min.js',
					'bower_components/angular-resource/angular-resource.js',
					'bower_components/angular-bootstrap/ui-bootstrap.min.js',
					'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
					'bower_components/angular-socket-io/socket.js'
				],
				dest: 'public/javascripts/libs.js',
			},
			css: {
				src: [
					'bower_components/bootstrap/dist/css/bootstrap.css',
					'bower_components/font-awesome/css/font-awesome.css',

				],
				dest: 'public/styles/css/libs.css'
			}
		}
	};

	grunt.initConfig(config);

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	grunt.registerTask('common', ['jshint', 'stylus', 'clean', 'jade', 'concat', 'copy', 'browserify']);
	grunt.registerTask('default', ['common']);

	grunt.registerTask('javascripts', ['jshint:client', 'browserify']);

};