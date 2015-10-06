`object-tojson`
===============

Turn a Javascript primitive into its "flat" representation.
Aims to be equivalent to `JSON.parse(JSON.stringify(obj))`.
Note that it will recursively visit all properties and attempt to call
`toJSON`, before trying to parse the value. `undefined` is not a valid
JSON value, so it will attempt to remove properties that resolve to this value,
unless it is an array element, in which case it resolves to `null`

Usage
-----

```js

const serialise = require('object-tojson')

serialise({
  key: 'value',
  arr: [undefined, null, true],
  keyFn: {toJSON: function () { return 'valueFn' }}
}) // => {key: 'value', [null, null, true], keyFn: 'valueFn'}
```

License
-------

[ISC](LICENSE)
