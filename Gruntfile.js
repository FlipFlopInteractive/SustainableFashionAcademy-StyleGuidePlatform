/*global module:false*/
module.exports = function( grunt ){

	// load all grunt tasks
	require( 'load-grunt-tasks' )( grunt );

	// load Assemble task seperately as directive doesn't pick it up
	grunt.loadNpmTasks( 'assemble' );

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		clean: {
			all: {
				src: './dist/*'
			}
		},

		assemble: {
			options: {
				title: '<%= pkg.title %>',
				description: '<%= pkg.description %>',
				flatten: true,
				partials: [
					'./src/templates/partials/**/*.hbs',
					'./src/templates/layouts/**/*.hbs'
				],
				helpers: [ 
					'handlebars-helper-compose',
					'handlebars-helper-partial',
					'helper-slugify',
					'handlebars-helpers'
				],
				compose: {
					cwd: './src/content/',
				},
			},
			all: {
				src: './src/templates/layouts/index.hbs',
				dest: './dist/',
			}
		},

		replace: {
			development: {
				options: {
					variables: {
						styles: './css/styles.css',
						libs: './js/libs.js',
						scripts: './js/scripts.js'
					}
				},

				files: [{
					src: './dist/index.html',
					dest: './dist/index.html'
				}]
			},

			production: {
				options: {
					variables: {
						styles: './css/styles.min.css',
						libs: './js/libs.min.js',
						scripts: './js/scripts.min.js'
					}
				},

				files: [{
					src: './dist/index.html',
					dest: './dist/index.html'
				}]
			}
		},

		copy: {
			all: {
				expand : true,
				dest: './dist/',
				cwd: './src/assets/',
				src: [ '**/*.*' ]
			},
		},
		
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require( 'jshint-stylish' )
			},
			all: [
				'Gruntfile.js',
				'./src/scripts/*.js',
			]
		},

		bower_concat: {
			all: {
				dest: './dist/js/libs.js',
				dependencies: {
					'bootstrap': 'jquery',
					'fluidbox': 'jquery',
				},
				mainFiles: {}			
			}
		},

		concat: {
			all: {
				src: './src/scripts/scripts.js',
				dest: './dist/js/scripts.js'
			}
		},

		uglify: {
			all: {
				files: {
					'./dist/js/scripts.min.js': './dist/js/scripts.js',
					'./dist/js/libs.min.js': './dist/js/libs.js'
				}
			}
		},

		webfont: {
			icons: {
				src: './src/icons/*.svg',
				dest: './dist/fonts/',
				destCss: './src/styles/',
				options: {
					engine: 'node',
					font: 'icons',
					stylesheet: 'less',
					relativeFontPath: '../fonts/',
					destHtml: './src/icons/'
				}
			}
		},

		rename: {
			development: {
				files: [
					{ src: [ './src/styles/icons.less' ], dest: [ './src/styles/_icons.less' ] },
				]
			}
		},

		less: {
			development: {
				files: {
					'./dist/css/styles.css': './src/styles/styles.less'
				}
			},

			production: {
				options: {
					cleancss: true,
				},

				files: {
					'./dist/css/styles.min.css': './src/styles/styles.less'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'Android 2.3',
					'Android >= 4',
					'Chrome >= 20',
					'Firefox >= 24', // Firefox 24 is the latest ESR
					'Explorer >= 8',
					'iOS >= 6',
					'Opera >= 12',
					'Safari >= 6'
				]
			},

			development: {
				src: './dist/css/styles.css'
			},

			production: {
				src: './dist/css/styles.min.css'
			},
		},

		express: {
		    all: {
		        options: {
		            bases: ['./dist/'],
		            port: 9000,
		            hostname: "0.0.0.0",
		            livereload: true,
		            keepalive: true
		        }
		    }
		},

		watch: {
		    all: {
		    	files: [
		    		'Gruntfile.js',
					'./src/**/*.*'
		    	],
		    	tasks: [ 
		    		'prepare:development'
		    	],
	            options: {
    	            livereload: true
		        }
		    }
		},

		open: {
			all: {
				path: 'http://localhost:<%= express.all.options.port%>'
			}
		},

		'ftp-deploy': {
			production: {
				auth: {
					host: 'sustainablefashionacademy.org',
					port: 21,
					authKey: 'key',
				},
				src: './dist',
				dest: './public_html/branding/',
				exclusions: [ './dist/**/.DS_Store' ]
			}
		}
	});

	// Default task.
	grunt.registerTask( 'default', [

		'clean:all',
		'assemble:all',
		'copy:all',
		'jshint:all',
		'bower_concat:all',
		'concat:all',
		'webfont:icons',
		'rename:development'
	]);

	grunt.registerTask( 'prepare:development', [

		'default',
		'less:development',
		'autoprefixer:development',
		'replace:development',
	]);	

	grunt.registerTask( 'development', [

		'prepare:development',
		'open:all',
		'express:all',
		'watch:all'
	]);

	grunt.registerTask( 'prepare:production', [

		'default',
		'less:production',
		'autoprefixer:production',
		'replace:production',
		'uglify:all'
	]);

	grunt.registerTask( 'production', [

		'prepare:production',
		'ftp-deploy:production',
	]);
};
