
const get = require('lodash/get');
const PrettyError = require('pretty-error');
const exec = require('child_process').exec;
const inquirer = require('inquirer');
const validator = require('validator');
const uuid = require('node-uuid');
const yaml = require('yamljs');
const fs = require('fs');
const path = require('path');
const os = require('os');

const configYamlPath = path.join(os.homedir(), '.ndoc.yml');

const pe = new PrettyError();

// assume that many people have a global git email set
function attemptToFindEmail() {
  return new Promise(function(resolve, _reject) {
    const cmd = 'git config user.email';

    exec(cmd, function(error, stdout, stderr) {
      if (error || stderr) {
        return resolve(null);
      }
      resolve(stdout.trim());
    });
  })
}

// save a yaml config object to a file
function saveYamlConfig(config) {
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

module.exports = function() {
  const state = {
    email: null
  };
  attemptToFindEmail().then(function(email) {
    state.email = email;

    const questions = [
      {
        type: 'confirm',
        name: 'confirmemail',
        message: 'Is your email '+state.email+'?',
        when: function(answers) {
          return state.email != null;
        }
      },
      {
        type: 'input',
        name: 'email',
        message: (state.email ? 'Ok fine... ' : '') + 'What is your email?',
        when: function(answers) {
          return answers.confirmemail === false || !state.email;
        },
        validate: function(value) {
          if (validator.isEmail(value)) {
            return true;
          }
          return 'Please enter a valid email';
        }
      },
      {
        type: 'confirm',
        name: 'hasaccount',
        message: 'Do you already have an ndoc account?',
      },
      {
        type: 'input',
        name: 'key',
        message: 'What is your ndoc key?',
        when: function (answers) {
          return answers.hasaccount;
        }
      },
    ];

    inquirer.prompt(questions).then(function (answers) {
      const key = get(answers, 'key', uuid.v4());
      if (!answers.haskey) {
        console.log('Made you a new key!');
      }

      saveYamlConfig({
        email: answers.confirmemail ? state.email : answers.email,
        key: key,
        created: new Date()
      }).then(function() {
        console.log('Saved Config File: '+ configYamlPath);
      }).catch(function(err) {
        console.error(err);
      })

    }).catch(function(err) {
      console.log(err);
    });
  })
}

function saveKey() {

}
