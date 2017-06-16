#! /usr/bin/env node

const get      = require('lodash/get');
const key      = require('./commands/key');
const copykey  = require('./commands/copykey');
const generate = require('./commands/generate');
const getdoc   = require('./commands/getdoc');
const listdocs = require('./commands/listdocs');

if (get(process.argv, '2') === 'key') {
  key();
} else if (get(process.argv, '2') === 'copykey') {
  copykey()
} else if (get(process.argv, '2') === 'get') {
  getdoc(get(process.argv, '3'))
} else if (get(process.argv, '2') === 'list') {
  listdocs(get(process.argv, '3'))
} else {
  generate();
}
