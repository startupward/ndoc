#! /usr/bin/env node

const get = require('lodash/get');
const key = require('./lib/key');
const copykey = require('./lib/copykey');
const generate = require('./lib/generate');

if (get(process.argv, '2') === 'key') {
  key();
} else if (get(process.argv, '2') === 'copykey') {
  copykey()
} else {
  generate();
}
