'use strict';

const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');

module.exports = {
    constructCommand(originalDir) {
        if (!originalDir) originalDir = process.cwd();

        const gatlingBinDir = path.join(__dirname, 'lib', 'bin');
        process.chdir(gatlingBinDir);

        process.env['NO_PAUSE'] = true;

        const argv = process.argv || [];
        const args = this.addAbsolutePaths(argv.slice(2), originalDir);

        const executable = process.platform === 'win32'
              ? 'gatling.bat'
              : path.join(gatlingBinDir, 'gatling.sh');

        return [ executable, args ];
    },

    addAbsolutePaths(args, originalDir) {
        return args.map(arg => {
            // don't bother checking flags
            if (/^-/.test(arg)) {
                return arg;
            }

            const maybeDir = path.join(originalDir, arg);
            if (fs.existsSync(maybeDir)) {
                return maybeDir;
            }
            else {
                return arg;
            }
        });
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
