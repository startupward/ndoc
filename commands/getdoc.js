
const axios = require('axios');
const get = require('lodash/get');
const find = require('lodash/find');
const commandLineArgs = require('command-line-args');

const config = require('../lib/config')().config;
const docApiUrl = require('../lib/apiurl')();
const copy = require('../lib/copy');

const optionDefinitions = [
  // the default arg has to be multiple because the first param is actually the command name..
  // i.e. "get <ID>"
  { name: 'id',          alias: 'i', type: String,  multiple: true, defaultOption: true },
  { name: 'verbose',     alias: 'v', type: Boolean, defaultValue: false },
  { name: 'email',       alias: 'e', type: String,  defaultValue: get(config, 'email')},
  { name: 'key',         alias: 'k', type: String,  defaultValue: get(config, 'key')},
];

module.exports = function() {
  const options = commandLineArgs(optionDefinitions);

  const id = get(options, 'id.1');
  const url = `${docApiUrl}/${id}`;

  if (!id) {
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
    withCredentials: true,
    headers: {
      contentType: 'application/json',
      accept: 'application/json',
    },
  }).then(function(response) {
    console.log(response.data);
    const url = get(response, 'data.result_url', '');
    return copy(url).then(function() {
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
