#! /usr/bin/env node
const ng = require('./src/index.js');

// this would look nicer if we could do destructuring, but boo hiss
// v4.3.2
//
// const [ command, args ] = ng.constructCommand(process.cwd());
const ret = ng.constructCommand(process.cwd());
ng.runGatling(ret[0], ret[1]);
