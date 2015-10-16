'use strict'

// Should be step 9 - 12 of this with time:
// http://www.ecma-international.org/ecma-262/6.0/#sec-json.stringify
//
// And this:
// http://www.ecma-international.org/ecma-262/6.0/#sec-serializejsonproperty
module.exports = function parse (value) {
  if (value === undefined) return undefined
  if (value === null) return null
  if (typeof value.toJSON === 'function') return parse(value.toJSON())
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value
  if (typeof value === 'number') return isFinite(value) ? value : null
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.map(function (v) { return v === undefined ? null : parse(v) })
    if (Object.prototype.toString.call(value) === '[object Error]') return {}
    if (Object.prototype.toString.call(value) === '[object Object]') {
      var obj = {}
      for (var k in value) {
        if (value.hasOwnProperty(k)) {
          var parsed = parse(value[k])
          // Remove undefined fields
          if (parsed !== undefined) obj[k] = parsed
        }
      }

      return obj
    }
  }

  // Don't know what to do...
  return undefined
}
