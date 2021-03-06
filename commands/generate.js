
const axios = require('axios');
const get = require('lodash/get');
const find = require('lodash/find');
const commandLineArgs = require('command-line-args');

const config = require('../lib/config')().config;
const docApiUrl = require('../lib/apiurl')();
const copy = require('../lib/copy');

const optionDefinitions = [
  { name: 'inputfile',   alias: 'i', type: String,  multiple: true, defaultOption: true},
  { name: 'verbose',     alias: 'v', type: Boolean, defaultValue: false },
  { name: 'orientation', alias: 'l', type: String,  defaultValue: 'portrait' },
  { name: 'type',        alias: 't', type: String,  defaultValue: 'pdf' },
  { name: 'data',        alias: 'd', type: String,  defaultValue: '{"test": "Hello World"}' },
  { name: 'url',         alias: 'u', type: String,  defaultValue: null },
  { name: 'template',    alias: 'c', type: String,  defaultValue: '<div>{{test}}</div>' },
  { name: 'filename',    alias: 'n', type: String,  defaultValue: '' },
  { name: 'email',       alias: 'e', type: String,  defaultValue: get(config, 'email')},
  { name: 'key',         alias: 'k', type: String,  defaultValue: get(config, 'key')},
];

module.exports = function() {
  const options = commandLineArgs(optionDefinitions);

  if (!options.email || !options.key) {
    return console.error('You must specify --email and --key or run `ndoc key` to generate your config file!');
  }

  if (options.verbose) {
    console.log("Options:\n", options, "\n");
  }

  const requestData = {
    document_content: options.template,
    document_url: options.url,
    output_type: options.type,
    document_orientation: options.orientation,
    document_filename: options.filename,
    data: JSON.parse(options.data),
  };

  if (options.verbose) {
    console.log(`Using ${docApiUrl}`);
    console.log("Request:\n", requestData, "\n");
  }

  // Send a POST request to the API
  axios({
    method: 'post',
    url: docApiUrl,
    auth: {
      username: options.email,
      password: options.key,
    },
    headers: {
      contentType: 'application/json',
      accept: 'application/json',
    },
    data: requestData,
  }).then(function(response) {
    console.log(response.data);

    const url = get(response, 'data.result_url', '');
    copy(url).then(function() {
      console.log(`\nCopied ${url} to clipboard!\n`);
    })
  }).catch(function(err) {
    const defaultError = {
      status: 500,
      message: err || 'Unknown Error'
    };
    const message = get(err, 'response.data', defaultError);
    // const status = get(err, 'response.status');
    if (options.verbose) {
      console.log("Response:");
    }
    console.error(message)
  });
}
