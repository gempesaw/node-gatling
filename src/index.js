'use strict';

const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const isWin = () => process.platform === 'win32';
const getGatlingBinary = (gatlingBinDir) => isWin()
              ? 'gatling.bat'
              : path.join(gatlingBinDir, 'gatling.sh');

module.exports = {
    constructCommand(originalDir) {
        if (!originalDir) originalDir = process.cwd();

        const gatlingBinDir = path.join(__dirname, 'lib', 'bin');
        process.chdir(gatlingBinDir);

        const argv = process.argv || [];
        const args = this.addAbsolutePaths(argv.slice(2), originalDir);

        return [ getGatlingBinary(gatlingBinDir), args ];
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

    spawn(executable, args, opts) {
        const child = cp.spawn(executable, args, opts);

        process.on('exit', function() {
            child.kill();
        });

        child.stdout.on('data', function(chunk){
            console.log(chunk.toString());
        });

        child.stderr.on('data', function(chunk){
            console.log(chunk.toString());
        });

        return child;
    },

    getClassPath(args, originalDir) {
        const stringArgs = args.join(' ');

        const simulationFolder = /(?:-sf|--simulations-folder)\s+([^ ]+)/;
        const matches = stringArgs.match(simulationFolder);

        if (matches && matches[1] && fs.existsSync(matches[1])) {
            return matches[1];
        }
        else {
            return '';
        }
    },

    runGatling(originalDir) {
        const ret = this.constructCommand(originalDir);
        const executable = ret[0];
        const args = ret[1];

        const env = JSON.parse(JSON.stringify(process.env));
        if (isWin()) {
            env['NO_PAUSE'] = true;
        }

        const cp = this.getClassPath(args, originalDir);
        if (cp) {
            const oldClassPath = process.env['JAVA_CLASSPATH'] || '';
            env['JAVA_CLASSPATH'] = `${cp}:${oldClassPath}`;
        }

        return this.spawn(executable, args, { env });
    }
};
