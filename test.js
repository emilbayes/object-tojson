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
      'ünicøde': true
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
