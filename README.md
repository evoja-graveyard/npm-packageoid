# packageoid [![npm version](https://badge.fury.io/js/%40evoja%2Fpackageoid.svg)](https://badge.fury.io/js/%40evoja%2Fpackageoid) [![Build Status](https://travis-ci.org/evoja/npm-packageoid.png)](https://travis-ci.org/evoja/npm-packageoid)

Reads `package.json` as object and overrides it with `process.env.npm_package_...` values which could be defined in `.npmrc` files

## packageoid
Reads config of the module and applies environment variables as user's replacement.

Assume our `package.json` has following config:
```json
{
  "config": {
    "a": 1,
    "b": "2",
    "c": "m"
  },
  "x": "y",
  "script": {
    "sandbox": "node sandbox.js"
  }
}
```

And `sandbox.js` contains:
```js
var packageoid = require('@evoja/packageoid')
var package_json = packageoid(module)
```

Let's call `npm run sandbox`.
In this case `package_json` object will be equals
```js
{
  config: {
    a: 1,
    b: '1',
    c: 'm'
  },
  x: 'y',
  script: {
    sandbox: 'node sandbox.js'
  }
}
```
The most interesting part is `package_json.config` which equals to
```js
{
  a: 1,
  b: '1',
  c: 'm'
}
```

If we have the `.npmrc` file with following content:
```
fooproject:a=10
fooproject:b=10
fooproject:d=10
```
Then we have `package_json.config` equal to
```
{
  a: 10,
  b: '10',
  c: 'm'
}
```

We also may call the command: `npm run sandbox --fooproject:a=20 --fooproject:b=20`
`package_json` gets the content:
```
{
  a: 20,
  b: '20',
  c: 'm'
}
```

It tries to keep types of original fields.
```js
package,    env => result

'a',        'b' => 'b'
'a',        '2' => '2'
 1,         'b' =>  1
 1,         '2' =>  2
{a: 10},    '2' => {a: 10}
[10, 'hi'], '2' => [10, 'hi']
```

Actually when config is set to `null` or `undefined`, then environment variable equals to empty string. In this case we get following:
```js
 1,  '' => 0
'a', '' => ''
```




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





