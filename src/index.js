/* global process */
'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(rootPath){

  var dirToChangeTo = path.join(__dirname, 'lib', 'bin');
  process.chdir(dirToChangeTo);

  process.env['NO_PAUSE'] = true;

  var args = process.argv.slice(2);

  for(var i = 0; i < args.length; i++) {
    args[i] = args[i].replace('~', rootPath);
  }

  var executable = process.platform === 'win32'
      ? 'gatling.bat'
      : path.join(dirToChangeTo, 'gatling.sh');
  var child = spawn(executable, args);

  process.on('exit', function() {
    child.kill();
  });

  child.stdout.on('data', function(chunk){
    console.log(chunk.toString());
  });

  child.stderr.on('data', function(chunk){
    console.log(chunk.toString());
  });
};
