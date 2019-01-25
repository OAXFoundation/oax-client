/* eslint-env jest */
const Client = require('..')
const URL = require('url')
const Providers = require('ethers/providers')

describe('BaseExchangeClient', function() {
  it('can instantiate', function() {
    const provider = new Providers.JsonRpcProvider('http://localhost:8545')
    const identity = new Client.PrivateKeyIdentity(undefined, provider)
    const assetRegistry = new Client.AssetRegistry()
    const hubClient = new Client.Client(
      ['0xERC20'],
      identity,
      'http://dex.local',
      {
        operatorAddress: '0xBADC0FFEE',
        mediator: '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF'
      }
    )
    expect(
      () => new Client.BaseExchangeClient(identity, hubClient, assetRegistry)
    ).not.toThrow()
  })
})
