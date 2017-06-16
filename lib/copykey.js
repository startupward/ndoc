
const yaml = require('yamljs');
const fs = require('fs');
const path = require('path');
const os = require('os');

const configYamlPath = path.join(os.homedir(), '.ndoc.yml');

// https://gist.github.com/mkremins/11013151
function pbcopy(data) {
  return new Promise(function(resolve, reject) {
    const proc = require('child_process').spawn('pbcopy');
    proc.on('error', function(err) {
      reject(err);
    });
    proc.on('close', function(err) {
      resolve();
    });
    proc.stdin.write(data);
    proc.stdin.end();
  })
}

module.exports = function() {
  // copy key to clipboard
  try {
    const config = yaml.load(configYamlPath);

    try {
      pbcopy(config.key).then(function() {
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
    return console.error(new Error(`You don't have a valid config file: ${configYamlPath}`));
  }
}