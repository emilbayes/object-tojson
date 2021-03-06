'use strict'

// Should be step 9 - 12 of this with time:
// http://www.ecma-international.org/ecma-262/6.0/#sec-json.stringify
//
// And this:
// http://www.ecma-international.org/ecma-262/6.0/#sec-serializejsonproperty
module.exports = function parse (value, replacer, circular = false) {
  var propertyList
  if (replacer == null) replacer = (k, v) => v
  if (Array.isArray(replacer)) {
    propertyList = replacer
    replacer = (k, v) => v
  }

  const visited = new WeakMap()
  return _parse(value, replacer, '')

  function _parse (value, replacer, parent) {
    if (value != null && typeof value.toJSON === 'function') value = value.toJSON(parent)
    value = replacer.call(value, parent, value)
    if (value === undefined) return undefined
    if (value === null) return null
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') return value
    if (typeof value === 'number') return Number.isFinite(value) ? value : null
    if (typeof value === 'object') {
      if (visited.has(value)) {
        if (circular === false) throw new TypeError('cyclic object value')
        return visited.get(value)
      }

      if (Array.isArray(value)) {
        const arr = []
        visited.set(value, arr)

        for (let i = 0; i < value.length; i++) {
          const v = value[i]
          arr[i] = v === undefined ? null : _parse(v, replacer, i.toString())
        }

        return arr
      }
      if (Object.prototype.toString.call(value) === '[object Error]') return {}
      if (Object.prototype.toString.call(value) === '[object Object]') {
        const obj = {}
        visited.set(value, obj)

        for (let i = 0, keys = propertyList || Object.keys(value); i < keys.length; i++) {
          const k = keys[i]

          const parsed = _parse(value[k], replacer, k)
          // Remove undefined fields
          if (parsed !== undefined) obj[k] = parsed
        }

        return obj
      }
    }

    // Don't know what to do...
    return undefined
  }
}
