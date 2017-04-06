
const axios = require('axios');
const get = require('lodash/get');
const EMAIL = process.env.NDOC_EMAIL;
const KEY = process.env.NDOC_KEY;
const IS_RELEASE = get(process, 'env.DEV') !== 'true';
const docApiUrl = IS_RELEASE ?
  `https://docs.startupward.com/docs` :
  `http://localhost:3000/docs`;

module.exports = function(config) {
  const options = {
    debug: get(config, 'debug', false),
    orientation: get(config, 'orientation', 'portrait'),
    type: get(config, 'type', 'pdf'),
    data: get(config, 'data', '{"test": "Hello World"}'),
    url: get(config, 'url', null),
    template: get(config, 'template', '<div>{{test}}</div>'),
    filename: get(config, 'filename', ''),
    email: get(config, 'email', EMAIL),
    key: get(config, 'key', KEY),
  };

  if (!options.email || !options.key) {
    throw 'You must specify email and key!';
  }

  if (options.debug) {
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

  if (options.debug) {
    console.log("Request:\n", requestData, "\n");
  }

  // Send a POST request to the API
  return axios({
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
    return response.data;
  }).catch(function(err) {
    const defaultError = {
      status: 500,
      message: err || 'Unknown Error'
    };
    // const message = get(err, 'response.data', defaultError);
    // const status = get(err, 'response.status');
    if (options.debug) {
      console.log("Response:");
    }
    throw defaultError;
  });
};
