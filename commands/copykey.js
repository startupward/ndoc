
const yaml = require('yamljs');
const fs = require('fs');
const path = require('path');
const os = require('os');

const config = require('../lib/config')().config;
const copy = require('../lib/copy');

module.exports = function() {
  // copy key to clipboard
  try {
    try {
      copy(config.key).then(function() {
        console.log(`Copied ${config.key} to clipboard!`);
      }).catch(function(e) {
        console.error(new Error(`Could Not Copy ${config.key} To Clipboard!`));
      })
    }
    catch(e) {
      console.error(new Error(`Could not copy key to clipboard: ${config.key}`));
    }
  }
  catch(e) {
    return console.error(new Error(`You don't have a valid config file: ${configYamlPath}. Run \`ndoc key\` to generate a config file.`));
  }
}