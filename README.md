Reads `package.json` as object and overrides it with `process.env.npm_package_...` values which could be defined in `.npmrc` files


```js
var packageoid = require('@evoja/packageoid')
var package_json = packageoid(module)
```


```js
var packageoid = require('@evoja/packageoid')
var default_conf = {...}
var user_conf = {...}
var conf = packageoid.merge(default_conf, user_conf)
```
