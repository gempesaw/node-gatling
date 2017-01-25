'use strict';

const spawn = require('child_process').spawn;
const path = require('path');

module.exports = {
    constructCommand() {
        const dirToChangeTo = path.join(__dirname, 'lib', 'bin');
        process.chdir(dirToChangeTo);

        process.env['NO_PAUSE'] = true;

        const args = process.argv.slice(2);

        const executable = process.platform === 'win32'
            ? 'gatling.bat'
            : path.join(dirToChangeTo, 'gatling.sh');

        return [ executable, args ];
    },

    runGatling(executable, args) {
        const child = spawn(executable, args);

        process.on('exit', function() {
            child.kill();
        });

        child.stdout.on('data', function(chunk){
            console.log(chunk.toString());
        });

        child.stderr.on('data', function(chunk){
            console.log(chunk.toString());
        });
    }
};
