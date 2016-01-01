# packageoid [![npm version](https://badge.fury.io/js/%40evoja%2Fpackageoid.svg)](https://badge.fury.io/js/%40evoja%2Fpackageoid) [![Build Status](https://travis-ci.org/evoja/npm-packageoid.png)](https://travis-ci.org/evoja/npm-packageoid)

Reads `package.json` as object and overrides it with `process.env.npm_package_...` values which could be defined in `.npmrc` files

## packageoid.merge
Takes two arguments `default_conf` and `user_conf` it makes a deep copy of the `default_conf`, and applies the `user_conf` to it. The `user_conf` overrides mentioned fields of the `default_conf`.

```js
var packageoid = require('@evoja/packageoid')
var default_conf = {...}
var user_conf = {...}
var conf = packageoid.merge(default_conf, user_conf)
```

It has some rules. It does not replace anything by anything.
It tries to keep types of original fields.

default | user | result
--------|------|-------
string  | string | user's string
string  | number, object, array | type cast user's value to string <br/>`1 -> '1'`<br/>`{} => '[object Object]'`<br/>`[10, 'hi'] => '10,hi'`
number | number | user number
number | string | converts user's string to number or keeps default on failure
number | object, array | keeps default
object | object | deep merge with user's object
object | number, string, array | keeps default
array | number, string | keeps default
array | array | replace whole array with user's array, does not merge array values
array | object | builds new array where specific inicies were replaces with merges with user's values
value | undefined | keeps default
value | null | _is not specified yet,_ hovewer behaves somehow
undefined/unexisting | value | user's value. Does not make deep copy


Examples

```js
'a', 'b'        => 'b'
'a',  1         => '1'
'a', {}         => '[object Object]'
'a', [10, 'hi'] => '10,hi'`
 1,   2         =>  2
 1,  'a'|{}|[]  =>  1

{a: 10, b: '20', c: 30}, {a: '1', b: 2, d: 'x'} => {a: 1, b: '2', c: 30, d: 'x'}

{a: 10},             1|'a'|[]     => {a: 10}
[10, 'hi'],          1|'a'        => [10, 'hi']
[10, 'hi', {a: 30}], [1]          => [1]
[10, 'hi', {a: 30}], {2: {b: 40}} => [10, 'hi', {a: 30, b: 40}]
```



## packageoid
Reads config of the module and applies environment variables as user's replacement.

```js
var packageoid = require('@evoja/packageoid')
var package_json = packageoid(module)
```


