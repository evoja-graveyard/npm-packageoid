'use strict';
var fs = require('fs')
var path = require('path')
var tools = require('./tools.js')

function find (pmodule, dir) {
  // completely got it here:
  // https://github.com/indexzero/node-pkginfo/blob/master/lib/pkginfo.js
  if (! dir) {
    dir = path.dirname(pmodule.filename);
  }
  
  var files = fs.readdirSync(dir);
  
  if (~files.indexOf('package.json')) {
    return path.join(dir, 'package.json');
  }
  
  if (dir === '/') {
    throw new Error('Could not find package.json up from: ' + dir);
  }
  else if (!dir || dir === '.') {
    throw new Error('Cannot find package.json from unspecified directory');
  }
  
  return find(pmodule, path.dirname(dir));
};

function packageoid (pmodule, env, dir) {
  // Thanks to this wrong answer:
  // http://stackoverflow.com/a/10855054/1549127
  var data = require(find(pmodule, dir))
  return tools.actualize(data, 'npm_package', env || process.env)
}

module.exports = packageoid;
module.exports.merge = tools.merge;
