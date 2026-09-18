const child_process = require('child_process');

const tests = [
  'jam_ASAP',
  'jam_JIT',
  'search_ASAP',
  'search_JIT'
];

// iterate the tests
for (let test of tests) {

  var workerProcess = child_process.exec('node ' + test,

    function(error, stdout, stderr) {

      if (error) {
        // console.log(error.stack);
      }

      if (stdout) {
        console.log('output :' + test);
        console.log(stdout);
      }

      if (stderr) {
        console.log('output :' + test);
        console.log(stderr);
      }

    });
};
