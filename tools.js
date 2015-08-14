'use strict';

var is_number = exports.is_number = function is_number (a) {
  return typeof a == 'number'
}

var is_string = exports.is_string = function is_string (a) {
  return typeof a === 'string'
}

var is_array = exports.is_array = Array.isArray || function is_array(a) {
  return !is_string(a) && Object.prototype.toString.call(a) === '[object Array]';
}

var is_object = exports.is_object = function is_object(a) {
  return !!a && (typeof a === 'object') && !is_array(a)
}

var convert_key = exports.convert_key = function convert_key(key) {
  return key.replace(/[-.]/g, '_')
}

var actualize = exports.actualize = function actualize(data, prefix, env) {
  if (is_array(data)) {
    var result = []
    for (var i = 0; i < data.length; ++i) {
      result.push(actualize(data[i], prefix + '_' + i, env))
    }
    return result
  }

  if (is_object(data)) {
    var result = {}
    for (var k in data) {
      result[k] = actualize(data[k], prefix + '_' + convert_key(k), env)
    }
    return result
  }

  var env_val = env[prefix]

  if (is_string(data)) {
    return env_val === undefined ? data : env_val + ''
  }

  if (is_number(data)) {
    var number = Number(env_val)
    return isNaN(number) ? data : number;
  }
  
  return env_val === undefined ? data : env_val
}
