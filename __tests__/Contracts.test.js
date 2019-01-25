/* eslint-env jest */
const Client = require('..')
const FS = require('fs')

describe('Client', function() {
  it('has contracts path', function() {
    const files = FS.readdirSync(Client.ContractsPath).sort()
    expect(files).toStrictEqual([
      'ERC20.abi',
      'ERC20.bin',
      'Mediator.abi',
      'Mediator.bin'
    ])
  })
})
