
const axios = require('axios');
const get = require('lodash/get');
const find = require('lodash/find');
const commandLineArgs = require('command-line-args');

const config = require('../lib/config')().config;
const docApiUrl = require('../lib/apiurl')();
const copy = require('../lib/copy');

const optionDefinitions = [
  // the default arg has to be multiple because the first param is actually the command name..
  // i.e. "list <pagenumber>"
  { name: 'page',        alias: 'p', type: Number,  multiple: true, defaultValue: 1, defaultOption: true },
  { name: 'limit',       alias: 'l', type: Number,  defaultValue: 10},
  { name: 'verbose',     alias: 'v', type: Boolean, defaultValue: false },
  { name: 'email',       alias: 'e', type: String,  defaultValue: get(config, 'email')},
  { name: 'key',         alias: 'k', type: String,  defaultValue: get(config, 'key')},
];

module.exports = function() {
  const options = commandLineArgs(optionDefinitions);

  const page = get(options, 'page.1');
  const url = `${docApiUrl}?page=${page}&limit=${options.limit}`;

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
    console.log(get(response, 'data.pages.docs', []).map(function(d) {
      return JSON.stringify(d);
    }));
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
