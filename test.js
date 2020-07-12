const test = require('tape')
const serialise = require('.')

test('equal to JSON.parse(JSON.stringify(obj))', function (assert) {
  const complex = {}

  Object.defineProperty(complex, 'nonEnumerable', {
    value: 'not present'
  })

  Object.defineProperty(complex, 'getable', {
    enumerable: true,
    get () {
      return 'gotten value'
    }
  })

  const everything = {
    undefinedValue: undefined,
    nullValue: null,
    trueValue: true,
    falseValue: false,
    infiniteValue: Infinity,
    nanValue: NaN,
    zeroValue: 0,
    finiteValue: 123.123,
    stringValue: 'string',
    objectValue: {
      ignoredValue: 'foo',
      toJSON: function () {
        return 'hello world'
      }
    },
    nested: {
      key: 'value',
      ünicøde: true
    },
    arrayValue: [
      undefined,
      null,
      true,
      false,
      Infinity,
      NaN,
      0,
      123.123,
      'string',
      {
        ignoredValue: 'foo',
        toJSON: function () {
          return 'hello world'
        }
      },
      {
        key: 'value'
      },
      ['nestedArray']
    ],
    error: new Error('some error message'),
    complex
  }

  assert.deepEqual(serialise(everything), JSON.parse(JSON.stringify(everything)))
  assert.end()
})

test('with replacer', function (assert) {
  const complex = {}

  Object.defineProperty(complex, 'nonEnumerable', {
    value: 'not present'
  })

  Object.defineProperty(complex, 'getable', {
    enumerable: true,
    get () {
      return 'gotten value'
    }
  })

  const everything = {
    undefinedValue: undefined,
    nullValue: null,
    trueValue: true,
    falseValue: false,
    infiniteValue: Infinity,
    nanValue: NaN,
    zeroValue: 0,
    finiteValue: 123.123,
    stringValue: 'string',
    objectValue: {
      ignoredValue: 'foo',
      toJSON: function () {
        return 'hello world'
      }
    },
    nested: {
      key: 'value',
      ünicøde: true
    },
    arrayValue: [
      undefined,
      null,
      true,
      false,
      Infinity,
      NaN,
      0,
      123.123,
      'string',
      {
        ignoredValue: 'foo',
        toJSON: function () {
          return 'hello world'
        }
      },
      {
        key: 'value'
      },
      ['nestedArray']
    ],
    error: new Error('some error message'),
    complex
  }

  function replacer (k, v) {
    if (k === 'error') return 'Error'
    return v
  }

  assert.deepEqual(serialise(everything, replacer), JSON.parse(JSON.stringify(everything, replacer)))
  assert.deepEqual(
    serialise(everything, ['objectValue', 'arrayValue', '0']),
    JSON.parse(JSON.stringify(everything, ['objectValue', 'arrayValue', '0'])))
  assert.end()
})

test('circular reference', function (assert) {
  const everything = []
  everything[0] = everything

  assert.throws(() => serialise(everything))
  assert.deepEqual(serialise(everything, null, true), everything)
  assert.end()
})
