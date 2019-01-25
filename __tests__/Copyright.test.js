/* eslint-env jest */
const FS = require('fs')
const Path = require('path')

describe('Copyright', () => {
  const PackageJson = require('../package.json')

  for (let jsFile of PackageJson.files.filter(fn => fn.endsWith('.js'))) {
    it(`${jsFile} has type definitions`, () => {
      expect(PackageJson.files).toContain(jsFile.replace(/\.js$/, '.d.ts'))
    })

    it(`${jsFile} has copyright notice`, () => {
      const text = FS.readFileSync(Path.join(__dirname, '..', jsFile), {
        encoding: 'utf-8'
      })
      expect(text).toContain('Copyright (c) 2018')
    })
  }

  for (let dtsFile of PackageJson.files.filter(fn => fn.endsWith('.d.ts'))) {
    it(`${dtsFile} has JS source`, () => {
      expect(PackageJson.files).toContain(dtsFile.replace(/\.d\.ts$/, '.js'))
    })
  }
})
