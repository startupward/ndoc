#! /usr/bin/env node

const get = require('lodash/get');
const key = require('./lib/key');
const generate = require('./lib/generate');

if (get(process.argv, '2') === 'key') {
  key();
} else {
  generate();
}
