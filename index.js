#! /usr/bin/env node
const ng = require('./src/index.js');

// this would look nicer if we could do destructuring, but boo hiss
// v4.3.2
//
// const [ command, args ] = ng.constructCommand();
const ret = ng.constructCommand();
ng.runGatling(ret[0], ret[1]);
