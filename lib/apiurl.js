
const get = require('lodash/get');

// cli usage: DEV=true ndoc generate ...

module.exports = function() {
  return get(process, 'env.DEV') !== 'true' ?
    `http://localhost:3000/docs`:
    `https://docs.startupward.com/docs`;

}