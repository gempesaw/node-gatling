const nodeGatling = require('../src/index.js');
const expect = require('chai').expect;
const path = require('path');

describe('Gatling execution', () => {
    const fakeArgv = [ 'node binary', 'file being executed', 'first arg', 'second arg' ];
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
            const argsWithPath = [
                'node binary',
                'file being executed',
                '-sf',
                '.'
            ];

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
});