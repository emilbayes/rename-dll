#!/usr/bin/env node
var spawn = require('child_process').spawnSync
var path = require('path')
var fs = require('fs')

var src = process.argv[2]
var dest = process.argv[3]
var arch = 'X64'

var prefixSrc = path.isAbsolute(src) ? '' : process.cwd()
var prefixDest = path.isAbsolute(dest) ? '' : process.cwd()

var definitions = spawn('dumpbin', ['/EXPORTS', path.join(prefixSrc, src)])

var functionRegex = /^\s+(\d+)\s+\d+\s+[A-Z0-9]+\s+([^ ]+(?: = [^ ]+))\s+$/i

var exports = definitions.stdout.toString()
  .split('\n')
  .filter(l => functionRegex.test(l))
  .map(s => s.match(functionRegex))
  .map(m => ({ordinal: m[1], fn: m[2]}))

var defContent = `
LIBRARY "${path.basename(dest, '.dll')}"
EXPORTS
${exports.map(e => e.fn.replace(/ += +/g, '=') + ' @' + e.ordinal).join('\n')}
`

var defBasename = path.basename(dest, '.dll') + '.def'
var defDirname = path.join(prefixDest, path.dirname(dest))

var defPath = path.join(defDirname, defBasename)

fs.writeFileSync(defPath, defContent)

var lib = spawn('lib', ['/MACHINE:' + arch, '/DEF:' + defBasename], {cwd: defDirname})
fs.renameSync(src, dest)
