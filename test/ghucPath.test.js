'use strict';

var Q = require('bluebird'),
  chai = require('chai'),
  tmp = require('tmp'),
  path = require('path'),
  shell = require('shelljs'),
  which = require('which'),
  Webu = require('webu');

var expect = chai.expect,
  should = chai.should();

var testUtils = require('./utils');

var source = require('../');

module.exports = {
  'bad path': function(done) {
    this.inst = source({
      ghucPath: '/usr/bin/doesnotexist',
    });

    this.inst.start().then(() => {
      throw new Error('Should not be here');
    }).catch((err) => {
      err += '';

      err.should.contain('Execution failed');
    }).asCallback(done);
  },

  'good path': {
    beforeEach: function() {
      var origGhucPath = which.sync('ghuc');
      this.binDir = path.join(__dirname, 'bin');

      shell.rm('-rf', this.binDir);
      shell.mkdir('-p', this.binDir);

      this.ghucPath = path.join(this.binDir, 'ghuc');

      shell.cp(origGhucPath, this.ghucPath);
    },

    afterEach: function(done) {
      shell.rm('-rf', this.binDir);

      if (this.inst) {
        this.inst.stop().asCallback(done);
      } else {
        done();
      }
    },

    default: function(done) {
      this.inst = source({
        // verbose: true,
        ghucPath: this.ghucPath,
      });

      this.inst.start().asCallback(done);
    },

    'path with spaces': function(done) {
      var newDir = path.join(this.binDir, 'child dir');

      shell.mkdir('-p', newDir);

      var newGhucPath = path.join(newDir, 'ghuc');

      shell.cp(this.ghucPath, newGhucPath);

      this.inst = source({
        // verbose: true,
        ghucPath: newGhucPath,
      });

      this.inst.start().asCallback(done);
    },
  },
};

