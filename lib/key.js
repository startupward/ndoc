
const get = require('lodash/get');
const PrettyError = require('pretty-error');
const exec = require('child_process').exec;

const pe = new PrettyError();

// assume that many people have a global git email set
function attemptToFindEmail() {
  return new Promise(function(resolve, _reject) {
    const cmd = 'git config user.email';

    exec(cmd, function(error, stdout, stderr) {
      if (error || stderror) {
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
  const inquirer = require('inquirer');
  attemptToFindEmail().then(function(email) {
    state.email = email;
  })

  inquirer.prompt([
    {
      type: 'list',
      name: 'hasKey',
      message: 'Do you already have a key?',
      choices: [
        'Yes',
        'No',
      ]
    },
  ]).then(function (answers) {
    const hasKey = get(answers, 'hasKey');

    if (hasKey) {
      const key = get(process.argv, 3);
      if (!key) {
        console.error(pe.render(new Error(
          'You must supply a key as the argument!'
        )));
      } else {
        // store it!
        console.log('Stored Key in ~/ndoc.yml!');
      }
    } else {
      // prompt for more answers
    }
  });
}

function saveKey() {

}

function gatherInfo() {
  inquirer.prompt([
    {
      type: 'text',
      name: 'email',
      message: 'What is your email?',
      choices: [
        'Yes',
        'No',
      ]
    },
  ]).then(function (answers) {
    const hasKey = get(answers, 'hasKey');

    if (hasKey) {
      // store it!
    } else {
      // prompt for more answers
    }
  });
}
