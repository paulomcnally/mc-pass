require('dotenv').config();
const assert = require('assert');
const which = require('which');
const exec = require('child_process').exec;

describe('Password', () => {
  describe('Check', () => {
    it('Generate the hash correctly.', (done) => {
      if (process.env.PASS_DEFAULT) {
        let nodeBin = which.sync('node');
        let command = `${nodeBin} ./cli.js facebook zuck`;

        exec(command, (error, stdout, stderr) => {
          let hash = stdout.replace(/\n$/, '');
          assert.equal(hash, process.env.PASS_DEFAULT);
          done();
        });
      } else {
        assert.fail('The PASS_DEFAULT environment variable is required.');
      }
    });
  });
});
