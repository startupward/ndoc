
const get = require('lodash/get');
const PrettyError = require('pretty-error');

const pe = new PrettyError();

module.exports = function() {
  const inquirer = require('inquirer');
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
