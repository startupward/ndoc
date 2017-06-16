
const get = require('lodash/get');
const PrettyError = require('pretty-error');
const exec = require('child_process').exec;
const inquirer = require('inquirer');
const validator = require('validator');
const uuid = require('node-uuid');

const pe = new PrettyError();
const config = require('../lib/config')();
const copy = require('../lib/copy');

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
        default: false,
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
        console.log(`\nMade you a new key! ${key}\n`);
      }

      return config.backup().then(function() {
        return config.save({
          message: 'daniel is building a cool app',
          email: answers.confirmemail ? state.email : answers.email,
          key,
          created: new Date()
        }).then(function() {
          console.log(`Saved Config File: ${config.path}`);
          return copy(key).then(function() {
            console.log(`Copied ${key} to clipboard!`);
          });
        });
      });

    }).catch(function(err) {
      console.log(err);
    });
  })
}

function saveKey() {

}
