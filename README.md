# Lynks Client
Lynks desktop client, providing access to the Lynks eco-system and services

INFO- Install dependencies:
`yarn install`

Fix call signature incompatibility between kad storage functions and local storage as follows:

> kad-localstorage.js (line 12) - add a useless third argument

`KadLocalStorage.prototype.get = function(key, justAnObject, cb) {
  var val = localStorage.getItem(this._prefix + key)
  if(!val) return cb(new Error('not found'))
  cb(null, val)
}`

> kad-localstorage.js (line 18) - add a useless third argument

`KadLocalStorage.prototype.put = function(key, val, justAnObject, cb) {
  key = this._prefix + key
  localStorage.setItem(key, val)
  cb(null, localStorage[key])
}`

We are using localStorage instead of levelup because we could not get level to work within our Electron app.
