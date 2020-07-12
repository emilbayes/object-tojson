# `object-tojson`

[![Build Status](https://travis-ci.org/emilbayes/object-tojson.svg?branch=master)](https://travis-ci.org/emilbayes/object-tojson)

> Turn a Javascript primitive into its "flat" representation. Aims to be equivalent to `JSON.parse(JSON.stringify(obj))`.

## Usage

Turn a Javascript primitive into its "flat" representation.
Aims to be equivalent to `JSON.parse(JSON.stringify(obj))`.
Note that it will recursively visit all properties and attempt to call
`toJSON`, before trying to parse the value. `undefined` is not a valid
JSON value, so it will attempt to remove properties that resolve to this value,
unless it is an array element, in which case it resolves to `null`.

```js
var serialise = require('object-tojson')

serialise({
  key: 'value',
  arr: [undefined, null, true],
  keyFn: {toJSON: function () { return 'valueFn' }}
}) // => {key: 'value', [null, null, true], keyFn: 'valueFn'}

// Impl compliant with replacer array
serialise({
  key: 'value',
  arr: [undefined, null, true],
  keyFn: {toJSON: function () { return 'valueFn' }}
}, ['key', 0]) // => {key: 'value', [null, null, true]}

// Spec compliant with replacer array
serialise({
  key: 'value',
  arr: [undefined, null, true],
  keyFn: {toJSON: function () { return 'valueFn' }}
}, ['key', 0], true) // => {key: 'value', [null, null, null]}
```

## API

### `serialise(value, [replacer], [specCompliant = false], [circular = false])`

Recursively serialise value as `JSON.strinfigy`, with optional `replacer`.
`replacer(key, value)` is called with the holder of `vale` as the context (`this`).
Return the replacement for `value` from this function.

`specCompliant` makes the `replacer` spec compliant. The spec says the replacer
must be applied recursively to array elements with the index as the key, however
neither Chrome nor Firefox let's you filter array elements in this way.

`circular` controls whether circular references should throw an error like
`JSON.stringify` or preserve a circular reference to the serialised result.

``

## Install

```sh
npm install object-tojson
```

## License

[ISC](LICENSE)
