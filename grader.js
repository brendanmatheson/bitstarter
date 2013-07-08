#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var rest = require('restler');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://polar-hollows-3646.herokuapp.com/";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
return out;
};


/*This is where the bulk of the script initiates
program - this is a commander module variable, initialised at the top of the file
commander sets command-line options so that the following command line arg can be processed
 ./grader.js --checks checks.json --file index.html

.option('-c this instructs commander module to load the filename following into program.checks
.option('-f this instructs commander module to load the filename following into program.file

these arguments are then passed to the checkHtmlFile function and, in turn, the checkJson function

JSON.stringify is relatively simple just turns into a JSON object whatever is loaded into it
in this instance the string returned to checkJson by checkHtmlFile - https://developer.mozilla.org/en-US/docs/JSON
*/

if(require.main == module) {
    program
	.option('-c, --checks ', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
	.option('-f, --file ', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
	.option('-u, --url ', 'Path to url', assertFileExists, URL_DEFAULT)
	.parse(process.argv);
    //var checkJson = '';

    if(program.url !== undefined){
    rest.get(program.url).on('complete', function(result){
	if (result instanceof Error) {
console.error('Hello Error Mr: ');


	} else {
fs.writeFile('urlOut.html', result, function (err) {
if (err) throw err;
console.log('It\'s saved!');
//this wokrs but i may have to return something thenuse that return
//something wrongwith asycn? think checkHtml is being called prematurely
var checkJson = checkHtmlFile('urlOut.html',program.checks);
var outJson = JSON.stringify(checkJson,null,4);
console.log(outJson);
});
	}
    });
	//this may not work may have to be a string

    }

    else if(program.file !== undefined ){
	var checkJson = checkHtmlFile(program.file,program.checks);
    }

    else{
	console.log("No nothing given");
	process.exit(1);
    }

    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
