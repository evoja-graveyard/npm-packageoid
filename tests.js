'use strict';

var tools = require('./tools.js');

function curry (fun, _args) {
  var slice = Array.prototype.slice 
  var args = slice.call(arguments, 1)
  var result_fun = function(_rest) {
    return fun.apply(this, args.concat(slice.call(arguments)))
  }
  result_fun.orig_name = fun.name
  return result_fun
}

function test_is_funs (test, fun, obj, expected) {
  var message = (fun.name || fun.orig_name) + '(' + obj + ') must be ' + expected
  test.equal(fun(obj), expected, message)
}

exports.test_is_array = function(test) {
  var check = curry(test_is_funs, test, tools.is_array)
  check([], true)
  check(null, false)
  check(undefined, false)
  check("", false)
  check({}, false)
  check(1, false)
  test.done()
}

exports.test_is_string = function(test) {
  var check = curry(test_is_funs, test, tools.is_string)
  check([], false)
  check(null, false)
  check(undefined, false)
  check("", true)
  check({}, false)
  check(1, false)
  test.done()
}

exports.test_is_object = function(test) {
  var check = curry(test_is_funs, test, tools.is_object)
  check([], false)
  check(null, false)
  check(undefined, false)
  check("", false)
  check({}, true)
  check(1, false)
  test.done()
}

exports.test_is_number = function(test) {
  var check = curry(test_is_funs, test, tools.is_number)
  check([], false)
  check(null, false)
  check(undefined, false)
  check("", false)
  check({}, false)
  check(1, true)
  test.done()
}

exports.test_convert_key = function(test) {
  var check = function(val, expected) {
    test.equal(tools.convert_key(val), expected)
  }
  check('mama-mila-ramu', 'mama_mila_ramu')
  check('mama_mila_ramu', 'mama_mila_ramu')
  check('mama.mila.ramu', 'mama_mila_ramu')
  check('oLoLo', 'oLoLo')
  test.done()
}

exports.test_actualize = function(test) {
  var prefix = 'npm_package'
  var env = {
    npm_package_version: '0.0.1',
    npm_package_config_str: 'STRstrSTR',
    npm_package_config_Num_0: '801',
    npm_package_config_num_1: '800fdsa',
    npm_package_config_arr_0: '900',
    npm_package_config_arr_1_0: '500',
    npm_package_config_arr_1_1: '600',
    npm_package_config_arr_2_0: '100x',
    npm_package_config_arr_2_1: '200',
    npm_package_config_arr_3_x: '300',
    npm_package_config_arr_3_y: '400',
    npm_package_config_arr_3_w: '700',
  }
  var profile = {
    version: '0.0.0',
    config: {
      m: 'mm',
      n: 10,
      str: 'strstr',
      'Num-0': 20,
      'num-1': 30,
      arr: [
        '80',
        '90',
        [40, 41],
        {x: 50, y: 60, z: 70}
      ]
    }
  }
  var expected = {
    version: '0.0.1',
    config: {
      m: 'mm',
      n: 10,
      str: 'STRstrSTR',
      'Num-0': 801,
      'num-1': 30,
      arr: [
        '900',
        '90',
        [40, 200],
        {x: 300, y: 400, z: 70}
      ]
    }
  }
  var result = tools.actualize(profile, 'npm_package', env)
  test.deepEqual(result, expected)
  test.done()
}
