const nodeGatling = require('../src/index.js');
const expect = require('chai').expect;
const path = require('path');
const td = require('testdouble');

describe('Gatling execution', () => {
    const fakeArgv = [ 'node binary', 'file being executed', 'first arg', 'second arg' ];
    const argsWithPath = [
        'node binary',
        'file being executed',
        '-sf',
        '.'
    ];

    let originalDir = process.cwd();
    let originalEnv = process.env;
    beforeEach(() => {
        // reset all the process stuff we're messing with
        process.argv = [];
        process.chdir(originalDir);
        process.env = originalEnv;
    });

    describe('unix', () => {
        beforeEach(() => {
            Object.defineProperty(process, 'platform', {
                value: 'not-win32'
            });
        });

        it('should use the entire path in the command', () => {
            const command = nodeGatling.constructCommand()[0];
            expect(command).to.match(/^\//);
            expect(command).to.include(__dirname.replace(/\/test$/, ''));
        });

        it('should pass through the arguments', () => {
            process.argv = fakeArgv.slice(0);
            const args = nodeGatling.constructCommand()[1];
            expect(args).to.eql(fakeArgv.slice(2));
        });

        it('should convert relative paths to absolute ', () => {
            process.argv = argsWithPath;
            const args = nodeGatling.constructCommand(__dirname)[1];
            expect(args).to.eql(['-sf', __dirname]);
        });
    });

    describe('windows', () => {
        beforeEach(() => {
            Object.defineProperty(process, 'platform', {
                value: 'win32'
            });
        });

        it('should not use the entire path in the command', () => {
            const command = nodeGatling.constructCommand()[0];
            expect(command).to.equal('gatling.bat');
        });

        it('should pass through the arguments', () => {
            process.argv = fakeArgv.slice(0);
            const args = nodeGatling.constructCommand()[1];
            expect(args).to.eql(fakeArgv.slice(2));
        });
    });

    describe('env', () => {
        beforeEach(() => {
            Object.defineProperty(process, 'platform', {
                value: 'win32'
            });
        });

        it('should append the simulation folder to the classpath ', () => {
            process.argv = argsWithPath;
            td.replace(nodeGatling, 'spawn');

            // clear the env to make the matching easier
            process.env = {};
            const env = { NO_PAUSE: true, JAVA_CLASSPATH: ".:"};

            nodeGatling.runGatling('.');
            td.verify(nodeGatling.spawn(td.matchers.anything(), td.matchers.anything(), { env }));
        });
    });
});
