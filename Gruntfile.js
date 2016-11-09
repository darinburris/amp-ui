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
					excludes: ['\\js/lib$'],
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
					title: 'My Software Name',
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
		 *   @description grunt task validates markup using vnu.jar markup checker (https://validator.github.io/validator/).
		**/
		htmllint: {
			all: {
				options: {
					force: true,
					errorlevels: ['warning','error'],
					reporter: 'json',
					reporterOutput: 'reports/validation/html-validation.json'
				},
				src: 'release/**/*.html'
			}
		},

		/**
		 *   @description grunt task validates markup against WCAG2.0 AA accessibility guidelines
		**/
		accessibility: {
			options: {
				accessibilityrc: true,
				verbose: false,
				accessibilityLevel: ampConfig.quality.wcag,
				reportType: 'json',
				domElement: true,
				force: true,
				reportLocation: 'reports/accessibility',
				reportLevels: {
					notice: false,
					warning: false,
					error: true
				}
			},
			test: {
				files: [{
					expand: true,
					cwd: ampConfig.base.releaseDir,
					src: ['**/*.html']//,
//					dest: ampConfig.quality.wcagDir,
//					ext: ampConfig.quality.wcagExt
				}]
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
		 * @description grunt task Analyze your CSS using parker.
		 */
		parker: {
			options: {
				metrics: [
					'TotalStylesheets',
					'TotalStylesheetSize',
					'TotalRules',
					'TotalSelectors',
					'TotalIdentifiers',
					'TotalDeclarations',
					'SelectorsPerRule',
					'IdentifiersPerSelector',
					'SpecificityPerSelector',
					'TopSelectorSpecificity',
					'TopSelectorSpecificitySelector',
					'TotalIdSelectors',
					'TotalUniqueColours',
					'UniqueColours',
					'TotalImportantKeywords',
					'TotalMediaQueries',
					'MediaQueries'
				],
				file: 'reports/css/report.md',
				colophon: true,
				usePackage: false
			},
			src: [
				'release/css/**/*.css'
			]
		},
		/**
		 * @description grunt task takes a set of markdown files and converts them to HTML
		 */
		markdown: {
			all: {
				files: [
					{
						expand: true,
						src: 'reports/css/report.md',
						colophon: true,
						ext: '.html'
					}
				],
				options: {
					template: 'reportsBaseFiles/_parker.html',
					markdownOptions: {
						gfm: true,
						highlight: 'manual',
						codeLines: {
							before: '<span>',
							after: '</span>'
						}
					}
				}
			}
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
		 *  @description grunt jscs code style linter and formatter for your style guide
		 */
		jscs: {
			src: 'source/js/modules/**/*.js',
			options: {
				config: '.jscsrc',
				fix: false
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
		 *  @description grunt task generates jsdoc documentation
		 */
		jsdoc: {
			dist: {
				jsdoc: 'node_modules/.bin/jsdoc',
				src: ['<%= sourceDir %>/js/**/*.js','!<%= releaseDir %>/js/**/*.js', 'README.md', '!<%= releaseDir %>/js/lib/**/*.js', 'Gruntfile.js', '!<%= releaseDir %>/js/amp.js'],
				options: {
					destination: 'reports/jsdocs',
					template: 'node_modules/ink-docstrap/template',
					configure: 'jsdoc.json'
				}
			}
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
				tasks: ['sass:watching'],
				options: {
					spawn: false
				}
			},
			js: {
				files: [
					ampConfig.base.sourceDir + '/js/**/*', '!' + ampConfig.base.sourceDir + '/js/lib/**'
				],
				tasks: ['eslint'],
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
				['clean:preRelease', 'copy:buildHTML', 'copy:buildIMG', 'includes', 'replace:localize', 'genTOC','sprite', 'sass:dist', 'copy:buildJS','clean:postRelease']//'rjsReplace', , 'jscs'
			);
		}
	);
	/**
	 * @description This task omits the ccsmin and uglify tasks for debugging purposes, includes JSDoc
	 */
	grunt.registerTask(
		'dev',
		'This task omits the ccsmin and uglify tasks for debugging purposes',
		function() {
			grunt.config.set('taskName', this.name);
			grunt.task.run(
				['clean:preRelease', 'copy:buildHTML', 'copy:buildIMG', 'includes', 'replace:localize', 'genTOC','sprite', 'sass:dist', 'copy:buildJS','clean:postRelease']//'rjsReplace', , 'jscs'
			);
		}
	);
	/**
	 *  @description QA task(s), Reporting on code quality, css/js minification. Must be run cleanly prior to a Prod build
	 */
	grunt.registerTask(
		'qa',
		'QA task(s), includes css/js minification',

		function() {
			grunt.config.set('taskName', this.name);
			grunt.task.run(
				['clean:preRelease', 'copy:buildHTML', 'copy:buildIMG', 'includes', 'replace:localize', 'genTOC', 'reports', 'sprite', 'sass:dist', 'cssmin', 'copy:buildJS', 'strip', 'babel', 'jscs','uglify','jsdoc','clean:postRelease']);
		}
	);

	/**
	 *  @description Production task(s), includes css/js minification, excludes JSDoc and Plato tasks
	 */
	grunt.registerTask(
		'prod',
		'Production task(s), includes css/js minification',
		function() {
			grunt.config.set('taskName', this.name);
			grunt.task.run(
				['clean:preRelease', 'copy:buildHTML', 'copy:buildIMG', 'includes', 'replace:localize', 'genTOC', 'sprite', 'sass:dist', 'cssmin', 'copy:buildJS', 'strip', 'uglify','jsdoc','clean:postRelease']);
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
		var tocULStart = '<ul id="tocList" role="list">',
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
	/**
	 * @description Fails build if validation and accessability errors were found.\nThis allows for the tasks to complete, and reports to be generated, while haulting the build from completion if errors are present.
	 */
	grunt.registerTask('failHard', 'Fails build if validation and accessability errors were found.\nThis allows for the tasks to complete, and reports to be generated, while haulting the build from completion if errors are present.', function() {
		var error = 'There were validation and/or accessibility errors found in your code.\nYou can view them at http://localhost:3000/views\n\n\n\n',
			validationReport = grunt.file.read(ampConfig.quality.w3cStatusDir),
			accessibilityReport = grunt.file.read(ampConfig.quality.wcagBaseFile),
			isValidationError = validationReport.indexOf(':false') === -1 ? false : true,
			isAccessibilityError = accessibilityReport.indexOf('ERROR') === -1 ? false : true;
		console.log(isValidationError + ', ' + isAccessibilityError);
		if (isValidationError || isAccessibilityError) {
			grunt.fail.fatal(error);
		} else {
			grunt.task.run('clean:reports');
		}
	});
	/**
	 * @description Running and Generating W3C/WCAG Reports
	 */
	grunt.registerTask('reports', 'Running and Generating W3C/WCAG Reports', function() {
		var fsx = require('fs-extra'),
			path = require('path'),
			fs = require('fs'),
			reportsDir = ampConfig.base.reportsDir,
			reportsViewsDir = ampConfig.base.reportsViewsDir,
			reportsTempDir = ampConfig.base.reportsTempDir,
			reportsViewPath = path.join(reportsDir, reportsViewsDir);
		fsx.mkdirsSync(path.join(reportsDir, reportsViewsDir));
		fsx.copySync(reportsTempDir, reportsViewPath);
		grunt.task.run(['accessibility','htmllint','parker','markdown']);//, 'BuildWCAGJSON'
	});
	/**
	 * @description Includes framework for dynamically including static html content into files from external html files
	 */
	grunt.registerTask('buildWCAGJSON', 'Build json file from the collective accessibility reports.', function() {
		var fs = require('fs'),
			glob = require('glob'),
			path = require('path'),
			jsonIN = '[',
			jsonBODY,
			jsonOUT = ']',
			jsonFINAL,
			rawData,
			data,
			reportSection,
			list,
			files,
			html;
		var walk = function(dir) {
			list = fs.readdirSync(dir);
			var newI;
			for (var i = 0; i < list.length; i++) {
				newI = i + 1;
				if ((fs.lstatSync(dir + '/' + list[i]).isDirectory())) {
					reportSection = list[i];
					if (i === 0) {
						jsonBODY = '{';
						jsonBODY = jsonBODY += '"section":"' + reportSection + '",';
						jsonBODY = jsonBODY += '"fileData":[';
						jsonBODY = jsonBODY += '{';
					} else {
						jsonBODY = jsonBODY += '{';
						jsonBODY = jsonBODY += '"section":"' + reportSection + '",';
						jsonBODY = jsonBODY += '"fileData":[';
						jsonBODY = jsonBODY += '{';
					}
					glob(dir + '/' + list[i] + '/**/*.json', {
						strict: true,
						sync: true,
						stat: true,
						cwd: __dirname
					}, function(er, files) {
						var newJ;
						for (var j = 0; j < files.length; j++) {
							newJ = j + 1;
							if ((fs.lstatSync(files[j]).isFile())) {
								var reportFile = files[j].replace('-report-dom.json', '.html'),
									reportFile = path.basename(reportFile);
								rawData = fs.readFileSync(files[j]);
								data = JSON.parse(rawData);
								data = JSON.stringify(data);
								jsonBODY = jsonBODY += '"file":"' + reportFile + '",';
								jsonBODY = jsonBODY += '"report":';
								jsonBODY = jsonBODY += data;
								if (newJ < files.length) {
									jsonBODY = jsonBODY += '},{';
								} else if (newJ === files.length) {
									jsonBODY = jsonBODY += '}]';
								}
							}
						}
					});
					if (newI < list.length) {
						jsonBODY = jsonBODY += '},';
					} else if (newI === list.length) {
						jsonBODY = jsonBODY += '}';
					}
				}
			}
			jsonFINAL = jsonIN + jsonBODY;
			jsonFINAL = jsonFINAL + jsonOUT;
			fs.writeFileSync('reports/accessibility.json', jsonFINAL);
			grunt.task.run(['failHard']);
		};
		walk('reports/accessibility');
	});
};
