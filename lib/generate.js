
module.exports = function() {

  process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });
}
