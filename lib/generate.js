
const axios = require('axios');
const startupwardDocUrl = `http://localhost:3000/docs`;
const find = require('lodash/find');
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'verbose',     alias: 'v', type: Boolean, defaultValue: false },
  { name: 'orientation', alias: 'l', type: String,  defaultValue: 'portrait' },
  { name: 'type',        alias: 't', type: String,  defaultValue: 'pdf' },
  { name: 'data',        alias: 'd', type: String,  defaultValue: "{test: 'Hello World'}" },
  { name: 'template',    alias: 'c', type: String,  defaultValue: '<div>{{test}}</div>' },
  { name: 'output',      alias: 'o', type: String,  defaultValue: '' },
  { name: 'inputfile',   alias: 'i', type: String,  multiple: true, defaultOption: true},
];

module.exports = function() {
  const options = commandLineArgs(optionDefinitions)
  console.log(options);
// .forEach(function (val, index, array) {
  //   console.log(index + ': ' + val);
  // });
  //
  // // Send a POST request
  // axios({
  //   method: 'post',
  //   url: startupwardDocUrl,
  //   data: {
  //     firstName: 'Fred',
  //     lastName: 'Flintstone'
  //   }
  // });
}
