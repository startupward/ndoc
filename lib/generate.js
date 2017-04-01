
const axios = require('axios');
const get = require('lodash/get');
const find = require('lodash/find');
const commandLineArgs = require('command-line-args');

const IS_RELEASE = get(process, 'env.DEV') !== 'true';
const docApiUrl = IS_RELEASE ?
  `https://docs.startupward.com/docs` :
  `http://localhost:3000/docs`;

  console.log('using: ', docApiUrl)

const optionDefinitions = [
  { name: 'verbose',     alias: 'v', type: Boolean, defaultValue: false },
  { name: 'orientation', alias: 'l', type: String,  defaultValue: 'portrait' },
  { name: 'type',        alias: 't', type: String,  defaultValue: 'pdf' },
  { name: 'data',        alias: 'd', type: String,  defaultValue: '{"test": "Hello World"}' },
  { name: 'url',         alias: 'u', type: String,  defaultValue: null },
  { name: 'template',    alias: 'c', type: String,  defaultValue: '<div>{{test}}</div>' },
  { name: 'filename',    alias: 'n', type: String,  defaultValue: '' },
  { name: 'inputfile',   alias: 'i', type: String,  multiple: true, defaultOption: true},
];

module.exports = function() {
  const options = commandLineArgs(optionDefinitions)

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
    console.log("Request:\n", requestData, "\n");
  }

  // Send a POST request to the API
  axios({
    method: 'post',
    url: docApiUrl,
    auth: {
      username: 'janedoe',
      password: 's00pers3cret'
    },
    headers: {
      contentType: 'application/json',
      accept: 'application/json',
    },
    data: requestData,
  }).then(function(response) {
    console.log(response.data);
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
