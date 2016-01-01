'use strict';

var tl = require('../test-lib.js')
var tools = tl.require('tools.js');

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
  check("1", false)
  check("true", false)
  check("false", false)
  check({}, false)
  check(1, false)
  check(0, false)
  check(true, false)
  check(false, false)
  test.done()
}

exports.test_is_string = function(test) {
  var check = curry(test_is_funs, test, tools.is_string)
  check([], false)
  check(null, false)
  check(undefined, false)
  check("", true)
  check("1", true)
  check("true", true)
  check("false", true)
  check({}, false)
  check(1, false)
  check(0, false)
  check(true, false)
  check(false, false)
  test.done()
}

exports.test_is_object = function(test) {
  var check = curry(test_is_funs, test, tools.is_object)
  check([], false)
  check(null, false)
  check(undefined, false)
  check("", false)
  check("1", false)
  check("true", false)
  check("false", false)
  check({}, true)
  check(1, false)
  check(0, false)
  check(true, false)
  check(false, false)
  test.done()
}

exports.test_is_number = function(test) {
  var check = curry(test_is_funs, test, tools.is_number)
  check([], false)
  check(null, false)
  check(undefined, false)
  check("", false)
  check("1", false)
  check("true", false)
  check("false", false)
  check({}, false)
  check(1, true)
  check(0, true)
  check(true, false)
  check(false, false)
  test.done()
}

exports.test_is_boolean = function(test) {
  var check = curry(test_is_funs, test, tools.is_boolean)
  check([], false)
  check(null, false)
  check(undefined, false)
  check("", false)
  check("1", false)
  check("true", false)
  check("false", false)
  check({}, false)
  check(1, false)
  check(0, false)
  check(true, true)
  check(false, true)
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
    npm_package_config_bool_tun: '1',
    npm_package_config_bool_fun: '1',
    npm_package_config_bool_tze: '0',
    npm_package_config_bool_fze: '0',
    npm_package_config_bool_ttru: 'true',
    npm_package_config_bool_ftru: 'true',
    npm_package_config_bool_tfal: 'false',
    npm_package_config_bool_ffal: 'false',
    npm_package_config_bool_tTRU: 'TRUE',
    npm_package_config_bool_fTRU: 'TRUE',
    npm_package_config_bool_tFAL: 'FALSE',
    npm_package_config_bool_fFAL: 'FALSE',
    npm_package_config_bool_numt: '10',
    npm_package_config_bool_numf: '10',
    npm_package_config_bool_str_ff: 'fdsa',
    npm_package_config_bool_str_tf: 'fdsa',
    npm_package_config_bool_str_fe: '',
    npm_package_config_bool_str_te: '',
    npm_package_config_bool_tt: 't',
    npm_package_config_bool_ft: 't',
    npm_package_config_bool_tf: 'f',
    npm_package_config_bool_ff: 'f',
    npm_package_config_bool_tT: 'T',
    npm_package_config_bool_fT: 'T',
    npm_package_config_bool_tF: 'F',
    npm_package_config_bool_fF: 'F',
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
      bool: {
        tun: true,
        fun: false,
        tze: true,
        fze: false,
        ttru: true,
        ftru: false,
        tfal: true,
        ffal: false,
        tTRU: true,
        fTRU: false,
        tFAL: true,
        fFAL: false,
        numt: true,
        numf: false,
        'str.ff': false,
        'str.tf': true,
        'str.fe': false,
        'str.te': true,
        tt: true,
        ft: false,
        tf: true,
        ff: false,
        tT: true,
        fT: false,
        tF: true,
        fF: false
      },
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
      bool: {
        tun: true,
        fun: true,
        tze: false,
        fze: false,
        ttru: true,
        ftru: true,
        tfal: false,
        ffal: false,
        tTRU: true,
        fTRU: true,
        tFAL: false,
        fFAL: false,
        numt: true,
        numf: false,
        'str.ff': false,
        'str.tf': true,
        'str.fe': false,
        'str.te': true,
        tt: true,
        ft: true,
        tf: false,
        ff: false,
        tT: true,
        fT: true,
        tF: false,
        fF: false
      },
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

exports.test_merge = function(test) {
  var user = {
    version: '0.0.1',
    config: {
      str: 'STRstrSTR',
      bool: {
        tun: '1',
        fun: 1,
        tze: '0',
        fze: 0,
        ttru: 'true',
        ftru: true,
        tfal: false,
        ffal: 'false',
        tTRU: 'TRUE',
        fTRU: 'TRUE',
        tFAL: 'FALSE',
        fFAL: 'FALSE',
        numt: '10',
        numf: 10,
        'str.ff': 'fdsa',
        'str.tf': 'fdsa',
        'str.fe': '',
        'str.te': '',
        tt: 't',
        ft: 't',
        tf: 'f',
        ff: 'f',
        tT: 'T',
        fT: 'T',
        tF: 'F',
        fF: 'F'
      },
      'Num-0': '801',
      'num-1': '800fdsa',
      arr: [
        '900',
        [500, 600],
        ['100x', 200],
        {x: 300, y: 400, w: 700},
        800,
        [900, '990']
      ]
    }
  }
  var profile = {
    version: '0.0.0',
    config: {
      m: 'mm',
      n: 10,
      str: 'strstr',
      bool: {
        tun: true,
        fun: false,
        tze: true,
        fze: false,
        ttru: true,
        ftru: false,
        tfal: true,
        ffal: false,
        tTRU: true,
        fTRU: false,
        tFAL: true,
        fFAL: false,
        numt: true,
        numf: false,
        'str.ff': false,
        'str.tf': true,
        'str.fe': false,
        'str.te': true,
        tt: true,
        ft: false,
        tf: true,
        ff: false,
        tT: true,
        fT: false,
        tF: true,
        fF: false
      },
      'Num-0': 20,
      'num-1': 30,
      arr: [
        '80',
        '90',
        [40, '41'],
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
      bool: {
        tun: true,
        fun: true,
        tze: false,
        fze: false,
        ttru: true,
        ftru: true,
        tfal: false,
        ffal: false,
        tTRU: true,
        fTRU: true,
        tFAL: false,
        fFAL: false,
        numt: true,
        numf: false,
        'str.ff': false,
        'str.tf': true,
        'str.fe': false,
        'str.te': true,
        tt: true,
        ft: true,
        tf: false,
        ff: false,
        tT: true,
        fT: true,
        tF: false,
        fF: false
      },
      'Num-0': 801,
      'num-1': 30,
      arr: [
        '900',
        [500, 600],
        ['100x', 200],
        {x: 300, y: 400, w: 700},
        800,
        [900, '990']
      ]
    }
  }
  var result = tools.merge(profile, user)
  test.deepEqual(result, expected)
  test.done()
}

exports.test_merge_obj_to_arr = function(test) {
  var user = {
    arr: {
      '0': 10,
      '2': {y: 20, z: 30},
      '3': 40,
      '4': 50
    }
  }

  var profile = {
    arr: [
      1,
      2,
      {x: 1, y: 2},
      undefined,
      null
    ]
  }

  var expected = {
    arr: [
      10,
      2,
      {x: 1, y: 20, z: 30},
      40,
      50
    ]
  }

  var result = tools.merge(profile, user)
  test.deepEqual(result, expected)
  test.done()
}

exports.test_merge_arr_to_arr = function(test) {
  var user = {
    arr: [
      10,
      null,
      {x: 10, y: 20},
      4
    ]
  }

  var profile = {
    arr: [
      1,
      2,
      {x: 1, y: 2},
      undefined,
      null,
      6
    ]
  }

  var expected = {
    arr: [
      10,
      null,
      {x: 10, y: 20},
      4
    ]
  }

  var result = tools.merge(profile, user)
  test.deepEqual(result, expected)
  test.done()
}
