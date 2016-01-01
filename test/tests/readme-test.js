'use strict';

var tl = require('../test-lib.js')
var packageoid = tl.require('index.js')
var merge = packageoid.merge
var me = module.exports

me.test_main = {}
me.test_main.just = (test) => {
  var res = packageoid(module).config
  test.deepEqual(res, {a: 1, b: '1', c: {d: 1}, e: [1, 'hi']})
  test.strictEqual(res.a, 1)
  test.strictEqual(res.b, '1')
  test.strictEqual(res.c.d, 1)
  test.strictEqual(res.e[0], 1)
  test.ok(Array.isArray(res.e))
  test.done()
}
me.test_main.types_num = (test) => {
  var env = {
    npm_package_config_a: '10',
    npm_package_config_b: '10',
    npm_package_config_c: '10',
    npm_package_config_d: '10',
  }
  var res = packageoid(module, env).config
  test.deepEqual(res, {a: 10, b: '10', c: {d: 1}, e: [1, 'hi']})
  test.strictEqual(res.a, 10)
  test.strictEqual(res.b, '10')
  test.strictEqual(res.c.d, 1)
  test.strictEqual(res.e[0], 1)
  test.ok(Array.isArray(res.e))
  test.done()
}
me.test_main.types_str = (test) => {
  var env = {
    npm_package_config_a: 'a',
    npm_package_config_b: 'a',
    npm_package_config_c: 'a',
    npm_package_config_d: 'a',
  }
  var res = packageoid(module, env).config
  test.deepEqual(res, {a: 1, b: 'a', c: {d: 1}, e: [1, 'hi']})
  test.strictEqual(res.a, 1)
  test.strictEqual(res.b, 'a')
  test.strictEqual(res.c.d, 1)
  test.strictEqual(res.e[0], 1)
  test.ok(Array.isArray(res.e))
  test.done()
}
me.test_main.types_empty = (test) => {
  var env = {
    npm_package_config_a: '',
    npm_package_config_b: '',
    npm_package_config_c: '',
    npm_package_config_d: '',
  }
  var res = packageoid(module, env).config
  test.deepEqual(res, {a: 0, b: '', c: {d: 1}, e: [1, 'hi']})
  test.strictEqual(res.a, 0)
  test.strictEqual(res.b, '')
  test.strictEqual(res.c.d, 1)
  test.strictEqual(res.e[0], 1)
  test.ok(Array.isArray(res.e))
  test.done()
}






me.test_merge = {}
me.test_merge.deep_copy = (test) => {
  var obj = {a: 10, b: {c: 20}}
  var copy = merge(obj, {})
  test.deepEqual(obj, copy)
  test.notStrictEqual(obj, copy)
  test.equal(obj.a, copy.a)
  test.notStrictEqual(obj.b, copy.b)
  test.equal(obj.b.c, copy.b.c)
  test.done()
}

me.test_merge.string_string = (test) => {
  var res = merge('a', 'b')
  test.strictEqual(res, 'b')
  test.done()
}

me.test_merge.string_number = (test) => {
  var res = merge('a', 1)
  test.strictEqual(res, '1')
  test.notStrictEqual(res, 1)
  test.done()
}

me.test_merge.string_objarr = (test) => {
  test.strictEqual(merge('a', {a: 10}), '[object Object]')
  test.strictEqual(merge('a', [10, 'hi']), '10,hi')
  test.done()
}

me.test_merge.number_number = (test) => {
  test.strictEqual(merge(1, 2), 2)
  test.done()
}

me.test_merge.number_string = (test) => {
  test.strictEqual(merge(1, '2'), 2)
  test.notStrictEqual(merge(1, '2'), '2')
  test.strictEqual(merge(1, 'a'), 1)
  test.done()
}

me.test_merge.number_objarr = (test) => {
  test.strictEqual(merge(1, {a: 10}), 1)
  test.strictEqual(merge(1, [10, 'hi']), 1)
  test.done()
}

me.test_merge.object_object = (test) => {
  var obj = {a: 10, b: '20', c: {d: 40, e: 'hi'}}
  var usr = {a: '1', b: 2, c: {d: 4, f: 5}}
  var res = merge(obj, usr)
  test.deepEqual(res, {a: 1, b: '2', c: {d: 4, e: 'hi', f: 5}})
  test.done()
}

me.test_merge.object_numstrarr = (test) => {
  var orig = {a: 10, b: '20', c: {d: 40, e: 'hi'}}
  var obj = {a: 10, b: '20', c: {d: 40, e: 'hi'}}
  test.deepEqual(merge(obj, 'hi'), orig)
  test.notStrictEqual(merge(obj, 'hi'), obj)
  test.deepEqual(merge(obj, 1), orig)
  test.notStrictEqual(merge(obj, 1), obj)
  test.deepEqual(merge(obj, [1, 'hi']), orig)
  test.notStrictEqual(merge(obj, [1, 'hi']), obj)
  test.done()
}

me.test_merge.array_numstr = (test) => {
  var orig = [10, '20', {d: 40, e: 'hi'}]
  var arr = [10, '20', {d: 40, e: 'hi'}]
  test.deepEqual(merge(arr, 'hi'), orig)
  test.notStrictEqual(merge(arr, 'hi'), arr)
  test.deepEqual(merge(arr, 1), orig)
  test.notStrictEqual(merge(arr, 1), arr)
  test.done()
}

me.test_merge.array_array = (test) => {
  var orig = [10, '20', {d: 40, e: 'hi'}]
  var obj = [10, '20', {d: 40, e: 'hi'}]

  var arr_orig = [1, {ma: 'ma'}]
  var arr = [1, {ma: 'ma'}]
  var res = merge(obj, arr)
  test.deepEqual(res, arr_orig)
  test.notStrictEqual(res, obj)
  test.strictEqual(res, arr)
  test.done()
}

me.test_merge.array_object = (test) => {
  var orig = [10, '20', {d: 40, e: 'hi'}]
  var obj = [10, '20', {d: 40, e: 'hi'}]
  var usr = {
    '1': 1,
    'b': 2,
    '2': {d: '4'}
  }
  test.deepEqual(merge(obj, usr), [10, '1', {d: 4, e: 'hi'}])
  test.notStrictEqual(merge(obj, usr), obj)
  test.done()
}

me.test_merge.value_undefined = (test) => {
  test.strictEqual(merge(1, undefined), 1)
  test.strictEqual(merge('1', undefined), '1')

  var orig = {a: 10}
  var obj = {a: 10}
  test.deepEqual(merge(obj, undefined), orig)
  test.notStrictEqual(merge(obj, undefined), obj)
  var arr_orig = [10, 'hi']
  var arr = [10, 'hi']
  test.deepEqual(merge(arr, undefined), arr_orig)
  test.notStrictEqual(merge(arr, undefined), arr)
  test.done()
}

me.test_merge.value_null = (test) => {
  // Waits specification
  test.done()
}

me.test_merge.undefined_value = (test) => {
  test.strictEqual(merge(undefined, 1), 1)
  test.strictEqual(merge(undefined, '1'), '1')
  var obj = {a: 10};
  test.strictEqual(merge(undefined, obj), obj)
  var arr = [10, 'hi'];
  test.strictEqual(merge(undefined, arr), arr)

  var deep_obj = {a: {b: 10}}
  var deep_usr = {b: {c: 20}}
  var deep_res = merge(deep_obj, deep_usr)
  test.deepEqual(deep_res, {a: {b: 10}, b: {c: 20}})
  test.notStrictEqual(deep_res.a, deep_obj.a)
  test.strictEqual(deep_res.b, deep_usr.b)
  test.done()
}