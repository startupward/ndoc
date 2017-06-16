
const os = require('os');
const path = require('path');
const yaml = require('yamljs');
const fs = require('fs');

module.exports = function() {
  const configYamlPath = path.join(os.homedir(), '.ndoc.yml');
  let config = {};

  // try to find email and password
  try {
    config = yaml.load(configYamlPath);
  } catch (e) {
    // do nothing, no config file
  }

  return {
    path: configYamlPath,
    config,
    // backup
    backup: function() {
      return new Promise(function(resolve, reject) {
        const proc = require('child_process').exec(`mv ${configYamlPath} ${configYamlPath}.bak`);
        proc.on('error', function(err) {
          reject(err);
        });
        proc.on('close', function(err) {
          resolve();
        });
      })
    },
    // save a yaml config object to a file
    save: function(config) {
      return new Promise(function(resolve, reject) {
        const yamlString = yaml.stringify(config, 4);

        fs.writeFile(configYamlPath, yamlString, {flag: 'w'}, function(err) {
          if(err) {
            return reject(err);
          }

          return resolve();
        });
      })
    }

  };
}
