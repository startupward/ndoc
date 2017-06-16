
const axios = require('axios');
const get = require('lodash/get');
const find = require('lodash/find');
const commandLineArgs = require('command-line-args');

const config = require('../lib/config')().config;
const docApiUrl = require('../lib/apiurl')();
const copy = require('../lib/copy');

const optionDefinitions = [
  { name: 'id',   alias: 'i', type: String,  multiple: true, defaultOption: true},
  { name: 'verbose',     alias: 'v', type: Boolean, defaultValue: false },
];

module.exports = function() {
  const options = commandLineArgs(optionDefinitions);
  
  const url = `${docApiUrl}/${get(options, 'id.1')}`;

  if (!options.id) {
    return console.error('You must specify --id to retrieve a document!');
  }

  if (options.verbose) {
    console.log("Options:\n", options, "\n");
  }

  if (options.verbose) {
    console.log(`Using ${url}`);
  }

  // Send a POST request to the API
  axios({
    method: 'get',
    url,
    auth: {
      username: options.email,
      password: options.key,
    },
    headers: {
      contentType: 'application/json',
      accept: 'application/json',
    },
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
