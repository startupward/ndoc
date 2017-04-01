
const axios = require('axios');
const startupwardDocUrl = `http://localhost:3000/docs`;
const get = require('lodash/get');
const find = require('lodash/find');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'verbose',     alias: 'v', type: Boolean, defaultValue: false },
  { name: 'orientation', alias: 'l', type: String,  defaultValue: 'portrait' },
  { name: 'type',        alias: 't', type: String,  defaultValue: 'pdf' },
  { name: 'data',        alias: 'd', type: String,  defaultValue: '{"test": "Hello World"}' },
  { name: 'template',    alias: 'c', type: String,  defaultValue: '<div>{{test}}</div>' },
  { name: 'filename',    alias: 'n', type: String,  defaultValue: '' },
  { name: 'inputfile',   alias: 'i', type: String,  multiple: true, defaultOption: true},
];

module.exports = function() {
  const options = commandLineArgs(optionDefinitions)

  // // Send a POST request
  axios({
    transformRequest: [function (req) {
      if (options.verbose) {
        console.log("Request:\n", req, "\n");
      }
      return JSON.stringify(req);
    }],
    method: 'post',
    url: startupwardDocUrl,
    auth: {
      username: 'janedoe',
      password: 's00pers3cret'
    },
    data: {
      document_content: options.template,
      output_type: options.type,
      document_orientation: options.orientation,
      document_filename: options.filename,
      data: JSON.parse(options.data)
    }
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
