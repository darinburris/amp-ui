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
  + Webpack for modular JavaScript development for higher quality, more maintainable JS code   
  + Grunt for managing the UI built process   
  + HTML & Accessibility Validation   
  + Sass, CSS Pre-processor   
  + CSS/JS minification   
  + ES Linting   
  + ESDoc for JavaScript documentation

## Folder Structure

### ROOT level files &amp; folders

#### gruntfile.js

Gruntfile.js file contains the build instructions for the Amp UI Repository. This file will process source files and run
them against predefined Grunt tasks resulting in release folder content.

>_The following tasks are included in the build_

>**Accessibility**

>Use HTML codesniffer to grade accessibility

>**clean**

>Clean files and folders

>**copy**

>Copy files

>**cssmin**

>Minify CSS

>**watch**

>Run predefined tasks whenever watched files change

>**htmllint**

>HTML W3C validation

>**esdoc**

>Generates source documentation using jsdoc

>**prompt**

>Interactive command line user prompts

>**replace**

>Replace text patterns with applause

>**sass**

>Compile SCSS to CSS

>**sprite**

>Spritesheet making utility

>**tempGen**

>Parent task for generating tempalate files based on a pre-defined list of available template types

>**tempCreate**

>This task is a follow-up task that generates templates based on the user selected tamplate type

>**genTOC**

>Task that generates a table of contents from the current file list, then injects this list into the index.html file

>**includes**

>Includes framework for dynamically including static html content into files from external html files

#### package.json

The Package.json file contains packaging instructions for NodeJS in regards to the Amp UI Repository.

#### amp-config.json

The amp-config.json file contains project specific configurations. Changes in this file can be modified to fit the specifics of any given project without the need to modify the Grintfile.js file.

#### .eslintrc

Config file for eslint task.

#### ESDoc

JavaScript documentation generated via ESDoc. Currently, generation is done via a standalone grunt task...

    grunt esdoc

Generated documentation can be viewed by visiting http://localhost:[port]/esdoc/index.html once documentation generation has been completed.

#### .gitignore

.gitignore is used to globally define what files are to be ignored by version control.
Example, /release, /node_modules, .sass-cache, validation_report

#### README.md

The README.md file contains highj level details about the Amp UI Repository.

### ./source/

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

#### NodeJs (v6.0.0)

    https://nodejs.org/dist/v4.1.1/node-v4.1.1.pkg

#### NVM - Node Version Manager - Simple bash script to manage multiple active node.js versions

    https://github.com/creationix/nvm

#### Grunt

    http://gruntjs.com/getting-started

#### Webpack

    https://webpack.github.io/

#### Sass

    http://sass-lang.com/

### Process for builds

Run npm install after getting latest code from GIT to make sure all proper npm packages are installed

    npm install

Run grunt after getting latest code and whenever you want to recompile the release folder

    grunt

After running Grunt, run webpack-dev-server, this bundles all dependencies and starts the dev server on port 3333

    webpack-dev-server

Once the dev server is running, start the mock API server. This specific server handles store requests by serving up mock store data to be used by Redux.

    json-server --watch store.json --port 3009

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

#### Webpack

Webpack is used to bundle JS modules as well as handle code transpilation.

Run webpack from root

    webpack

#### Webpack Dev Server

The architecure implements a WDS for viewing changes locally and managing JS module bundling in real time.

To start WDS simply type webpack-dev-server from the root directory.

    webpack-dev-server

#### JSON-server

A fake API server for stubbing out data. The current React implementation relies on this API for store functionality.

[JSON-Server](https://github.com/typicode/json-server "JSON-Server")

To start the API server simply type the following from the root directory...

    json-server --watch store.json --port 3009

## Helpfull Development Links

  * [Nice Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet "Nice Markdown Cheatsheet")
  * [Information on code complexity and how it is measured](http://jscomplexity.org/ "Information on code complexity and how it is measured")
  * [ESDoc Documentation](https://esdoc.org/ "JSDoc Ducmentation")
