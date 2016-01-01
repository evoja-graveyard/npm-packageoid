'use strict'
var tl = require('../test-lib.js')
var dcopy = tl.require('deep-copy.js')
var me = module.exports

var getObj = function() {
  return {
    a: 0,
    b: [0,1,2],
    c: {
      a: 0,
      b: 1,
    },
    d: function () {}
  }
}

var getArr = () => [
    0,
    1,
    {
      a: 0,
      b: {
        c: 1
      }
    }
  ]

me.deep_copy_object = function (test) {
  var obj = getObj()
  var copy = dcopy(obj)
  copy.c = {c: 15}
  test.deepEqual(obj.c, {a: 0, b: 1})
  test.deepEqual(copy.c, {c: 15})
  test.done()
}

me.deep_copy_array = function (test) {
  var arr = getArr()
  var copy = dcopy(arr)
  copy[2].b = {d: 15}
  test.deepEqual(arr[2].b, {c: 1})
  test.deepEqual(copy[2].b, {d: 15})
  test.done()
}

me.preserve_functions = function (test) {
  var obj = getObj()
  var copy = dcopy(obj)
  test.equal(typeof obj.d, 'function')
  test.equal(typeof copy.d, 'function')
  test.done()
}
