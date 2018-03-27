'use strict';

var Q = require('bluebird'),
  chai = require('chai'),
  tmp = require('tmp'),
  path = require('path'),
  shell = require('shelljs'),
  Webu = require('webu');

var expect = chai.expect,
  should = chai.should();

var testUtils = require('./utils');

var source = require('../');

module.exports = {
  afterEach: function(done) {
    Q.resolve().then(() => {
      if (this.inst && this.inst.isRunning) {
        return this.inst.stop();
      }
    }).asCallback(done);
  },
  'override': function(done) {
    this.inst = source({
      ghucOptions: {
        rpc: false,
        identity: 'testnode123',
        port: 44323,
        rpcport: 8545,
      },
    });

    this.inst.start().then(() => {
      let out = testUtils.ghucExecJs(this.inst.dataDir, `admin.nodeInfo`);
      out.should.contain('testnode123');
      out.should.contain('listener: 44323');
    }).then(() => {
      var webu = new Webu();
      webu.setProvider(
        new webu.providers.HttpProvider('http://localhost:8545'));

      webu.huc.coinbase.should.eql(this.inst.account);
    }).asCallback(done);
  },
};

