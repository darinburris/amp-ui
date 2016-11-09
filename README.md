#Amp UI Framework

## Description

UI framework

_Implements the following technologies_
  + NodeJS   
  + NPM   
  + Grunt   
  + Sass   
  + Webpack   

_Supports the following UI automations_   
  + NPM for package management   
  + Grunt for managing the UI built process   
  + HTML & Accessibility Validation   
  + Sass, CSS Pre-processor   
  + CSS/JS minification   
  + Webpack for modular JavaScript development for higher quality, more maintainable JS code   
  + JS Linting   
  + JSDoc and Plato for JavaScript documentation and quality reporting   

## Folder Structure

### ROOT level files &amp; folders

#### gruntfile.js

Gruntfile.js file contains the build instructions for the Amp UI Repository. This file will process source files and run
them against predefined Grunt tasks resulting in release folder content.

>_The following tasks are included in the build_

>**Accessibility**

>Use HTML codesniffer to grade accessibility

>**bower**

>Install Bower packages.                                     

>**concurrent**

>Run grunt tasks concurrently

>**clean**

>Clean files and folders

>**concat**

>Concatenate files

>**copy**

>Copy files

>**cssmin**

>Minify CSS

>**imagemin**

>Minify PNG, JPEG and GIF images

>**jshint**

>Validate files with JSHint

>**uglify**

>Minify files with UglifyJS

>**watch**

>Run predefined tasks whenever watched files change

>**gitinfo**

>Gather information about the git repository

>**validation**

>HTML W3C validation

>**jsdoc**

>Generates source documentation using jsdoc

>**nodemon**

>Runs a nodemon monitor of your node.js server

>**pagespeed**

>Run Pagespeed Insights

>**plato**

>Generate static analysis charts with plato

>**prompt**

>Interactive command line user prompts

>**replace**

>Replace text patterns with applause

>**sass**

>Compile SCSS to CSS

>**sprite**

>Spritesheet making utility

>**string-replace**

>String Replace Task

>**prod**

>Alias for "clean:preRelease", "copy:buildHTML", "includes",   
"genTOC", "concurrent:W3C", "sprite", "sass:dist", "cssmin", "replace:amp", "rjsReplace", "copy:buildJS", "jshint", "uglify", "clean:postRelease", "psi-ngrok" tasks

>**imgcompress**

>Alias for "newer:imagemin" task

>**imgsprite**

>Alias for "sprite" task

>**tempGen**

>Parent task for generating tempalate files based on a pre-defined list of available template types

>**tempCreate**

>This task is a follow-up task that generates templates based on the user selected tamplate type

>**genTOC**

>Task that generates a table of contents from the current file list, then injects this list into the index.html file

>**Reports**

>Running and Generating W3C/WCAG Reports

>**rjsReplace**

>A replace Task that copies the contents of "/bower_components/requirejs-bower/require.js" to a specified location in amp.js.

>This allows for the independent updating of the requirejs version without having to manually modify any source files.

>**psi-ngrok**

>Run pagespeed with ngrok

>Runs against /index.html unless another page is specified. To target a specific page, use "--path=" and the location of the page you wish to test.

>Ex: grunt --path=/account/index.html

>**gitInfo**

>Gather information from the current user's git config

>**failHard**

>Fails build if validation and accessability errors were found.

>This allows for the tasks to complete, and reports to be generated, while haulting the build from completion if errors are present.

>**includes**

>Includes framework for dynamically including static html content into files from external html files

#### package.json

The Package.json file contains packaging instructions for NodeJS in regards to the Amp UI Repository.

#### bower.json

The bower.json file contains packaging instructions for Bower in regards to the Amp UI Repository.

#### amp-config.json

The amp-config.json file contains project specific configurations. Changes in this file can be modified to fit the specifics of any given project without the need to modify the Grintfile.js file.

#### jsdoc.json

Used to customise JSDoc's behaviour

#### begin.js

begin.js file is used for starting the Node/Express server. At the command prompt type node begin.js.

#### .jshintrc & .jshintrcGrunt

Config files for jshint tasks. The Grunt version has some additional leniency backed in.

#### .gitignore

.gitignore is used to globally define what files are to be ignored by version control.
Example, /release, /node_modules, .sass-cache, validation_report

#### README.md

The README.md file contains highj level details about the Amp UI Repository.

### ./Source/

Source contains all the working copies of the UI Code base. These files are to be processed using Grunt tasks and deployed
to a /release folder in each environment based on environment specific instructions.

### ./templateBaseFiles/

Used by the tempGem grunt task to generate templates within the project

### ./reportsBaseFiles/

Used by the Reports grunt task to generate HTML & Accessibility report views

###Development Environment Dependencies

#### Git (_Windows only_)

Git will beed to be installed on anyone running a Windows machine since it is not available out of the box.

The following link provides some good instructions on how to choose the right distribution and tools for setting up Git on a Windows box.

    http://guides.beanstalkapp.com/version-control/git-on-windows.html

#### NodeJs (v4.1.1)

    https://nodejs.org/dist/v4.1.1/node-v4.1.1.pkg

#### NVM - Node Version Manager - Simple bash script to manage multiple active node.js versions

    https://github.com/creationix/nvm

#### Grunt

    http://gruntjs.com/getting-started

### Process for builds

Run npm install after getting latest code from GIT to make sure all proper npm packages are installed

    npm install

Run grunt after getting latest code and whenever you want to recompile the release folder

    grunt

or

    grunt prod

The difference between grunt and grunt prod is the addition of the CSS/JS minification/Concatination tasks.

For developement purposes simply run grunt.

### Important Architectural Features

#### Templating Engine

The Amp UI architecture contains a templating engine for generating page templates based on a pre-defined collection of template types.

Simply run the tempGen grunt task, define a template location (path) and name (NOTE: no extension needed), and choose a template type from the ones presented. The result is a generated template based on the provided criteria.

The grunt task looks like this...

    grunt tempGen --tempName=_the-path-and-filename_

You will then be presented with the available template options. Just choose a template.

#### Grunt Watch

Watches for changes to HTML, SCSS, and JS files and pushes changes to Release directory.

The grunt task looks like this...

    grunt watch

#### Node Server

The architecure implements a Node Express Server for viewing changes locally

To start the server simply type the following from the root directory

    node begin.js

## Helpfull Development Links

  * [Nice Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet "Nice Markdown Cheatsheet")
  * [Information on code complexity and how it is measured](http://jscomplexity.org/ "Information on code complexity and how it is measured")
  * [JSDoc Ducmentation](http://usejsdoc.org/ "JSDoc Ducmentation")
