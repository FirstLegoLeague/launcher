'use strict'

const symbols = {
  'host': 'Host'
}

const symbolsMap = new Map()

function escapeTemplates (str) {
  return str.replace(/({{|}})/g, s => `{{\`${s}\`}}`)
}

const CADDY_TAG = (strings, ...placeholders) => {
  const final = []

  strings.forEach((str, i) => {
    final.push(escapeTemplates(str))

    if (placeholders.length <= i) {
      return
    }

    const currentPlaceholder = placeholders[i]

    if (symbolsMap.has(currentPlaceholder)) {
      const variable = symbolsMap.get(currentPlaceholder)
      final.push(`{{.${variable}}}`)
    } else {
      final.push(escapeTemplates(currentPlaceholder.toString()))
    }
  })

  return final.join('')
}

Object.entries(symbols)
  .forEach(([symbol, variable]) => {
    const keyObject = {}

    CADDY_TAG[symbol] = keyObject
    symbolsMap.set(keyObject, variable)
  })

exports.$ = exports.C = exports.CADDY = exports.CADDY_TAG = CADDY_TAG
