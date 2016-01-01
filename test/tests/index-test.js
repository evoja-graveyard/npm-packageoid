'use strict';
var tl = require('../test-lib.js')
var tools = tl.require('tools.js');
var packageoid = tl.require('index.js');

exports.test_main_merge = function(test) {
  test.same(packageoid.merge, tools.merge)
  test.done()
}
