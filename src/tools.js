'use strict';

var deep_copy = require('./deep-copy.js')

var is_number = exports.is_number = function is_number (a) {
  return typeof a == 'number'
}

var is_boolean = exports.is_boolean = function is_boolean (a) {
  return typeof a == 'boolean'
}

var is_string = exports.is_string = function is_string (a) {
  return typeof a === 'string'
}

var is_array = exports.is_array = Array.isArray || function is_array(a) {
  return Object.prototype.toString.call(a) === '[object Array]';
}

var is_object = exports.is_object = function is_object(a) {
  return !!a && (typeof a === 'object') && !is_array(a)
}

var convert_key = exports.convert_key = function convert_key(key) {
  return key.replace(/[-.]/g, '_')
}

function is_env_null(a) {
  return a === null || a === 'null'
}

var merge = exports.merge = function merge(data, user) {
  if (is_array(data)) {
    if (is_object(user)) {
      var result = data.slice();
      for (var k in user) {
        var k_num = Number(k)
        if (typeof k_num == 'number' && !isNaN(k_num)) {
          result[k] = merge(data[k], user[k])
        }
      }
      return result
    }

    if (is_array(user)) {
      return user
    }

    return deep_copy(data)
  }

  if (is_object(data)) {
    if (!is_object(user)) {
      return deep_copy(data)
    }

    var result = {}
    for (var k in data) {
      result[k] = merge(data[k], user[k])
    }
    for (var k in user) {
      if (result[k] === undefined) {
        result[k] = user[k]
      }
    }
    return result;
  }

  if (is_string(data)) {
    return user === undefined ? data
         : is_env_null(user) ? null
         : (user + '')
  }

  if (is_number(data)) {
    var number = Number(user)
    return isNaN(number) ? data : number
  }

  if (is_boolean(data)) {
    switch (user) {
      case true: case 1: case '1':
      case 'true': case 'TRUE':
      case 't': case 'T':
        return true
      
      case false: case 0: case '0':
      case 'false': case 'FALSE':
      case 'f': case 'F':
        return false
      
      default:
        return data
    }
  }

  return user === undefined ? data
       : is_env_null(user) ? null
       : user
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
    return env_val === undefined ? data
         : is_env_null(env_val) ? null
         : (env_val + '')
  }

  if (is_number(data)) {
    var number = Number(env_val)
    return isNaN(number) ? data : number;
  }

  if (is_boolean(data)) {
    switch (env_val) {
      case '1': case 'true': case 'TRUE': case 't': case 'T': return true
      case '0': case 'false': case 'FALSE': case 'f': case 'F': return false
      default: return data
    }
  }

  return env_val === undefined ? data
       : is_env_null(env_val) ? null
       : env_val
}
