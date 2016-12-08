/**
 * @module grunt
 * @description exports Grunt config and tasks
 * @author Amplifi Commerce Presentation Layer Technology Group
 * [Built using Grunt, The JavaScript Task Runner]{@link http://gruntjs.com/}
 */
module.exports = function(grunt) {
	'use strict';
	var chalk = require('chalk'),
		ampConfig = require('./amp-config.json');
	// Load grunt tasks
	require('load-grunt-tasks')(grunt);
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sourceDir: ampConfig.base.sourceDir,
		releaseDir: ampConfig.base.releaseDir,
		releaseCss: ampConfig.base.releaseDir + '/css',
		releaseJs: ampConfig.base.releaseDir + '/js',
		srcScss: ampConfig.base.sourceDir + '/scss',
		srcJs: ampConfig.base.sourceDir + '/js',
		preReleaseCss: ampConfig.base.sourceDir + '/css',
		preReleaseJs: ampConfig.base.sourceDir + '/js',

		/**
		 * @description grunt include task recursively includes static html files into each other ******************
		**/
		includes: {
			build: {
				cwd: 'source',
				src: [ '*.html', '**/*.html' ],
				dest: 'release/',
				options: {
					flatten: true,
					includePath: 'source',
					includeRegexp: /^(\s*)<include\s+file="(\S+)"\s*\/>$/,
					banner: ''
				}
			}
		},

		/**
		 * @description grunt task to generate js documentation ******************
		**/
		esdoc : {
			dist : {
				options: {
					source: './source/js',
					destination: './release/esdoc',
					includes: ['\\.(js|jsx)$'],
					excludes: ["\\lib$"],
					//excludes: ['\\js/lib$'],
//					access: ['public', 'protected'],
//					autoPrivate: true,
					// unexportIdentifier: false,
					// undocumentIdentifier: true,
					// builtinExternal: true,
					// importPathPrefix: '',
					index: './README.md',
					package: './package.json',
					coverage: true,
					// test: {
					// 	type: 'mocha',
					// 	source: './test/src',
					// 	includes: ['Test\\.(js|es6)$'],
					// 	excludes: ['\\.config\\.(js|es6)$']
					// }
					title: ampConfig.base.appName,
					// styles: ['./path/to/style.css'],
					// scripts: ['./path/to/script.js']
				}
			}
		},

		/**
		 * @description grunt task to generate a sprite from a collection of .png files ******************
		**/
		sprite: {
			all: {
				src: 'source/img/sprites/*.png',
				dest: 'release/img/sprites.png',
				destCss: 'source/scss/_sprites.scss',
				imgPath: '../img/sprites.png'
			}
		},
		/**
		* @description  grunt task compiles sass files, copies them into a pre release
		* folder under /source/ in order to allow for linting prior to
		* minification/concatination
		**/
		sass: {
			options : {
				//includePaths: require('node-bourbon').includePaths,
				includePaths: require('node-neat').includePaths
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%=srcScss%>',
					src: ['**/*.scss', '!normalize.scss'],
					dest: '<%= releaseCss %>',
					ext: '.css',
					sourcemap: 'auto',
					style: 'expanded'
				}]
			},
			watching: {
				files: [{
					expand: true,
					cwd: grunt.file.readJSON('amp-config.json').base.sourceDir + '/scss/',
					src: ['*.scss', '!normalize.scss', '!sprites.scss'],
					dest: grunt.file.readJSON('amp-config.json').base.releaseDir + '/css/',
					ext: '.css',
					sourcemap: 'auto'
				}]
			}
		},
		/**
		 * @description grunt task lints scss files
		 */
		sasslint: {
			options: {
				configFile: '.sass-lint.yml',
			},
			target: [
				'source/scss/\*.scss',
				'!source/scss/_normalize.scss',
				'!source/scss/_tooltips.scss',
				'!source/scss/_sprites.scss',
				'!source/scss/_colorbox.scss'
			]
		},
		/**
		 * @description grunt task minimizes css files
		 */
		cssmin: {
			minify: {
				expand: true,
				cwd: grunt.file.readJSON('amp-config.json').base.releaseDir + '/css',
				src: ['**/*.css'],
				dest: grunt.file.readJSON('amp-config.json').base.releaseDir + '/css',
				ext: '.css'
			}
		},
		/**
		 *  @description grunt task for linting js and jsx code
		 */
		eslint: {
			options: {
				configFile: '.eslintrc'
			},
			target: ['<%= sourceDir %>/js/**/*.js','<%= sourceDir %>/js/**/*.jsx', '!<%= releaseDir %>/js/lib/**/*.js', '!<%= sourceDir %>/js/lib/**/*.js']
		},
		/**
		 *  @description grunt task minifies/obfuscates/concatinates js files
		 */
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				sourceMap: true,
				report: 'min',
				compress: true,
				mangle: true
			},
			main: {
				files: [{
					expand: true,
					cwd: '<%= releaseDir %>/js',
					src: ['**/*.js', '!lib/**/*.js'],
					dest: '<%= releaseDir %>/js',
					ext: '.js'
				}]
			}
		},
		/**
		 *  @description grunt task copies source code into release folder
		 */
		copy: {
			buildHTML: {
				files: [{
					expand: true,
					cwd: '<%= sourceDir %>',
					src: ['**/*.html', '!includes/**/*.html', '!js/lib/**/*.html','components/**/*','data/**/*','bower_components/**/*'],
					dest: '<%= releaseDir %>'
				}]
			},
			buildIMG: {
				files: [{
					expand: true,
					cwd: '<%= sourceDir %>',
					src: ['img/**/*', '!img/sprites/**/*'],
					dest: '<%= releaseDir %>'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: ampConfig.base.sourceDir,
					src: ['!' + ampConfig.base.sourceDir + '/img/sprites/**/*', '**/*.html', 'amp.js', 'js/lib/**/*.js', 'css/**/*.css'],
					dest: '<%= releaseDir %>/'
				}, {
					expand: true,
					cwd: '<%= releaseDir %>/',
					src: 'amp.js',
					dest: '<%= releaseDir %>/js/'
				}]
			},
			buildJS: {
				files: [{
					expand: true,
					cwd: 'source',
					src: ['js/**/*'],
					dest: 'release'
				}]
			},
			reports: {
				files: [{
					expand: true,
					cwd: './',
					src: 'reportsBaseFiles/*',
					dest: 'reports/views',
					flatten: true,
					filter: 'isFile'
				}]
			}
		},

		/**
		 * @description grunt task deletes specific, non-release files after build
		 */
		clean: {
			preRelease: ['<%= releaseDir %>'],
			postRelease: [
				ampConfig.base.sourceDir + '/css'
			],
			reports: ['./reports/']
		},
		/**
		 * @description grunt task Strip JavaScript nodes (like console.*) out of your source code
		 */
		strip: {
			main: {
				src: [
					ampConfig.base.releaseDir + '/**/*.js', '!' + ampConfig.base.releaseDir + '/lib/**/*.js'
				],
				options: {
					inline: true,
					nodes: ['console.log', 'debug', 'alert']
				}
			}
		},
		/**
		 * @description grunt task performs a number of string replacement actions on various files
		 */
		replace: {
			localize: {
				options: {
					patterns: [{
						match: 'langCntry',
						replacement: ampConfig.base.langCntry,
						expression: true
					}, {
						match: 'direction',
						replacement: ampConfig.base.direction,
						expression: true
					}]
				},
				files: [{
					expand: true,
					cwd: ampConfig.base.releaseDir,
					flatten: false,
					src: ['**/*.html', '!js', '!css'],
					dest: ampConfig.base.releaseDir
				}]
			},
			toc: {
				options: {
					patterns: [{
						match: '<!--toc-->',
						replacement: function() {
							return grunt.config.get('tocData');
						}
					}]
				},
				files: [{
					expand: true,
					cwd: ampConfig.base.releaseDir,
					flatten: true,
					src: ['index.html'],
					dest: ampConfig.base.releaseDir
				}]
			}
		},
		/**
		 *  @description grunt task propmts user for desired template during tempGen custom template generation task
		 */
		prompt: {
			temps: {
				options: {
					questions: [{
						config: 'echo.templatesList', // arbitray name or config for any other grunt task
						type: 'list', // list, checkbox, confirm, input, password
						message: 'Please choose a template type', // Question to ask the user, function needs to return a string,
						choices: ampConfig.templating.choices
					}],
					then: function(results) {
						var choice = '';
						for (var key in results) {
							if (key === 'length' || !results.hasOwnProperty(key)) {
								continue;
							}
							choice = results[key];
						}
						grunt.config.set('chosenTemplate', choice);
						grunt.task.run('tempCreate');
					}
				}
			}
		},
		/**
		 * @description grunt task watches to changes to files in /source and copies them into /release
		 */
		watch: {
			scss: {
				files: [
					ampConfig.base.sourceDir + '/scss/**/*.scss'
				],
				tasks: ['sass:watching','sasslint'],
				options: {
					spawn: false
				}
			},
			js: {
				files: [
					ampConfig.base.sourceDir + '/js/**/*', '!' + ampConfig.base.sourceDir + '/js/lib/**'
				],
				tasks: ['eslint','mochaTest'],
				options: {
					spawn: true
				}
			},
			html: {
				files: [
					ampConfig.base.sourceDir + '/**/*.html'
				],
				tasks: ['includes', 'genTOC', 'newer:copy:buildHTML'],
				options: {
					spawn: false
				}
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: ['babel-register']
				},
				src: ['spec/**/*.js']
			}
		}
	});

	/**
	 * @description This task omits the ccsmin and uglify tasks for debugging purposes, includes JSDoc
	 */
	grunt.registerTask(
		'default',
		'This task omits the ccsmin and uglify tasks for debugging purposes',
		function() {
			grunt.config.set('taskName', this.name);
			grunt.task.run(
				['clean:preRelease', 'copy:buildHTML', 'copy:buildIMG', 'includes', 'replace:localize', 'genTOC','sprite','sasslint','sass:dist','copy:buildJS','clean:postRelease','mochaTest']//'rjsReplace', , 'jscs'
			);
		}
	);

	//The following are custom registered tasks
	/**
	 * @description Parent task for generating tempalate files based on a pre-defined list of available template types.
	 */
	grunt.registerTask('tempGen', 'Parent task for generating tempalate files based on a pre-defined list of available template types.', function() {
		var ampConfig = require('./amp-config.json'),
			error = chalk.bgRed.white,
			templateToMake = grunt.option('tempName') || null,
			walk = require('walkdir'),
			source = 'source',
			cwd = process.cwd();
		grunt.config.set('templateToMake', templateToMake);
		grunt.config.set('gotoPrompt', true);
		if ((!templateToMake) || (templateToMake === null) || (templateToMake === true)) {
			console.log(error('Please provide a path and file name using --tempName=path/and/filename(no extension)'));
			console.log(error('To create a template at root level, simply provide the file name (no extension) --tempName=filename'));
			return;
		}
		walk.sync(source, function(wpath) {
			var extPos = wpath.lastIndexOf('.'),
				ext = wpath.substring(extPos),
				currFile = cwd + '/' + source + '/' + templateToMake + ext;
			if (currFile === wpath) {
				console.log(error('ERROR: You have chosen a template that already exists.\nPlease choose a different name.'));
				grunt.config.set('gotoPrompt', false);
				return;
			}
		});
		if (grunt.config.get('gotoPrompt') === true) {
			grunt.config.set('templateChoices', ampConfig.templating.choices);
			grunt.task.run('prompt:temps');
		}
	});
	/**
	 * @description This task is a follow-up task that generates templates based on the user selected tamplate type.
	 */
	grunt.registerTask('tempCreate', 'This task is a follow-up task that generates templates based on the user selected tamplate type.', function() {
		var choice = grunt.config.get('chosenTemplate'),
			extPos = choice.lastIndexOf('.'),
			ext = choice.substring(extPos),
			tempsPath = ampConfig.base.templateBaseFiles,
			templateToMake = grunt.config.get('templateToMake'),
			fsx = require('fs-extra'),
			source = ampConfig.base.sourceDir,
			templatePath = templateToMake,
			tempName = '';
		if (templatePath.indexOf('/') > 0) {
			templatePath = templateToMake.split('/');
			tempName = templatePath[templatePath.length - 1];
			templatePath = templatePath.join('/');
			templatePath = templatePath.replace(tempName, '');
			templatePath = source + '/' + templatePath;
			fsx.mkdirsSync(templatePath);
			fsx.copySync(tempsPath + '/' + choice, templatePath + '/' + choice);
			fsx.renameSync(templatePath + choice, templatePath + tempName + ext);
		} else {
			fsx.copySync(tempsPath + '/' + choice, source + '/' + choice);
			fsx.renameSync(source + '/' + choice, source + '/' + templatePath + ext);
		}
	});
	/**
	 * @description Task that generates a table of contents from the current file list Then injects this list into the index.html file
	 */
	grunt.registerTask('genTOC', 'Task that generates a table of contents from the current file list\nThen injects this list into the index.html file', function() {
		var ampConfig = grunt.file.readJSON('amp-config.json'),
			fs = require('fs'),
			walk = require('walkdir'),
			cheerio = require('cheerio'),
			source = ampConfig.base.releaseDir,
			fnames = [],
			titles = [],
			paths = [],
			TOC,
			parentTask = grunt.config.get('taskName');
		/**
		walk directory and return array of all .html files
		create arrays to hold...
		file names,
		<title></title> values for displaying in TOC list,
		full paths for each file returned
		*/
		walk.sync(source, function(path) {
			if ((path.substr(-5) === '.html') && (path.indexOf('release/index.html') === -1) && (path.indexOf('includes') === -1) && (path.indexOf('bower_components') === -1)) {
				var DOM = fs.readFileSync(path, 'utf8'),
					currFile = path.split('/'),
					fname = currFile.slice(-1)[0],
					$ = cheerio.load(DOM),
					title = $('title').text();
				titles.push(title);
				fnames.push(fname);
				paths.push(path);
			}
		});
		var tocULStart = '<ul id="tocList" class="toc-list" role="list">',
			tocLI = '',
			tocULEnd = '</ul>';
		//gruntgenerate TOC from html files
		if (titles.length === fnames.length) {
			for (var i in titles) {
				var pathPos = paths[i].indexOf(ampConfig.base.releaseDir),
					fullPath = paths[i].substring(pathPos),
					path = fullPath.replace(ampConfig.base.releaseDir, ''),
					webPath = path.replace(/\\/g, '/');
				console.log(webPath);
				tocLI += '<li role="listitem"><a href="' + webPath + '">' + titles[i] + '</a></li>';
			}
			if ((parentTask === 'default') || (parentTask === undefined)) {
				var reportsLinks = grunt.file.read('source/includes/quality-toc.html');
				TOC = tocULStart + tocLI + tocULEnd + reportsLinks;
			} else {
				TOC = tocULStart + tocLI + tocULEnd;
			}
			grunt.config.set('tocData', TOC);
			grunt.task.run('replace:toc');
		}
	});



};
