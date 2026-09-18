const child_process = require('child_process');

const tests = [
  'booking_flat',
  'booking_struct',
  'flat_schedule_ASAP',
  'flat_schedule_JIT',
  'flat_schedule_JIT',
  'release_dense',
  'release_loose',
  'struct_schedule_ASAP',
  'struct_schedule_JIT'
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
}
