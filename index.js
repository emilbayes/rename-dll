#!/usr/bin/env node
var spawn = require('child_process').spawnSync
var path = require('path')
var fs = require('fs')

var argv = require('minimist')(process.argv, {
  string: ['arch'],
  default: {
    'arch': 'X64'
  }
})

var src = argv._[0]
var dest = argv._[1]
var arch = argv.arch.toUpperCase()

if (arch == 'IA32') arch = 'X86'

if (src == null) {
  console.error('Missing SRC argument')
  process.exit(1)
}

if (dest == null) {
  console.error('Missing DEST argument')
  process.exit(1)
}

if (['X86', 'X64', 'ARM', 'ARM64'].indexOf(arch) < 0) {
  console.error('Invalid architecture')
  process.exit(1)
}

var prefixSrc = path.isAbsolute(src) ? '' : process.cwd()
var prefixDest = path.isAbsolute(dest) ? '' : process.cwd()

var definitions = spawn('dumpbin', ['/EXPORTS', path.join(prefixSrc, src)])

var functionRegex = /^\s*(\d+)\s+[A-Z0-9]+\s+[A-Z0-9]{8}\s+([^ ]+(?: = [^ ]+)?)\s*$/i

var exports = definitions.stdout.toString()
  .split('\n')
  .filter(l => functionRegex.test(l))
  .map(s => s.match(functionRegex))
  .map(m => ({ordinal: m[1], fn: m[2]}))

var defContent = `
LIBRARY "${path.basename(dest)}"
EXPORTS
${exports.map(e => e.fn.replace(/ += +/g, '=') + ' @' + e.ordinal).join('\n')}
`

var defBasename = path.basename(dest, '.dll') + '.def'
var defDirname = path.join(prefixDest, path.dirname(dest))

var defPath = path.join(defDirname, defBasename)

fs.writeFileSync(defPath, defContent)

var lib = spawn('lib', ['/MACHINE:' + arch, '/DEF:' + defBasename], {cwd: defDirname})
fs.renameSync(src, dest)
