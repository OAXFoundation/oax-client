const fs = require('fs')
const BigNumber = require('bignumber.js')
const Ethers = require('ethers')
const Providers = require('ethers/providers')
const OaxClient = require('../')

// CONFIGURATIONS

const CONFIG_FILE = 'config.json'
const PAIR = 'OAX/WETH'

async function main() {
  // Load config
  if (!fs.existsSync('config.json')) {
    // See `bin/config.example.json` for an example.
    throw new ApplicationError('Expected a config.json file with hub URL.')
  }

  let config = loadConfig()

  // Load / Create Wallet
  let wallet

  if (config.walletMnemonic) {
    wallet = Ethers.Wallet.fromMnemonic(config.walletMnemonic)
  } else {
    console.log('Wallet mnemonic not found. Creating new wallet...')
    wallet = Ethers.Wallet.createRandom()
    console.log(`Generated mnemonic ${wallet.mnemonic}.`)
    config.walletMnemonic = wallet.mnemonic

    saveConfig(config)
  }

  // print addresses
  console.log('\n########################################')
  console.log(`Wallet address: ${wallet.address}`)
  console.log(`Mediator address: ${config.mediatorAddress}`)
  console.log('########################################\n')

  // Initialize Client
  const provider = new Providers.JsonRpcProvider(config.providerUrl)
  const identity = new OaxClient.PrivateKeyIdentity(wallet.privateKey, provider)
  const hubClient = new OaxClient.Client(
    Object.values(config.assets),
    identity,
    config.hubUrl,
    {
      operatorAddress: config.operatorAddress,
      mediator: config.mediatorAddress
    }
  )

  const assetRegistry = new OaxClient.AssetRegistry()
  const assetNames = Object.keys(config.assets)
  for (var i = 0; i < assetNames.length; i++) {
    const name = assetNames[i]
    const address = config.assets[name]

    assetRegistry.add(name, address)
  }

  const exchangeClient = new OaxClient.BaseExchangeClient(
    identity,
    hubClient,
    assetRegistry
  )

  // Check hub status
  console.log('Checking if Hub is halted...')
  console.log(await hubClient.isHalted())

  console.log()

  // Join Hub
  console.log('Joining hub...')
  await exchangeClient.join()
  console.log('Joined hub successfully.')

  console.log()

  // Get order book
  console.log(`Getting ${PAIR} order book...`)
  console.log(await exchangeClient.fetchOrderBook(PAIR))

  console.log()

  // Get balances
  console.log(`Getting Exchange balances for address ${wallet.address}...`)
  console.log(await exchangeClient.fetchBalances())

  console.log()

  // Deposit
  {
    const token = 'OAX'
    const amount = new BigNumber('0.0001')

    console.log(`Depositing ${amount} ${token}...`)

    try {
      await exchangeClient.deposit(
        config.assets[token],
        amount,
        true
      )
    } catch (err) {
      console.error(`Deposit failed. Reason: ${err}`)
    }
  }

  console.log()

  // Get balances
  console.log(`Exchange balances after deposit...`)
  const balances = await exchangeClient.fetchBalances()
  console.log(balances)

  // Create order
  console.log('Selling 0.000000001 OAX for WETH...')
  {
    const side = 'sell'
    const amount = new BigNumber('0.000000001 ')
    const price = new BigNumber(1)                 // for 1 WETH
    try {
      const orderId = await exchangeClient.createOrder(
        PAIR,  // pair symbol
        'limit', // order type
        side,  // side
        amount,  // amount
        price    // price
      )
      console.log(`Order created successfully. Order ID ${orderId}`)
    } catch (err) {
      console.error(`Order creation failed. Reason: ${err.message}`)
    }
  }

  console.log()

  // Get order book
  console.log(`Order book for ${PAIR} after placing order...`)
  console.log(await exchangeClient.fetchOrderBook(PAIR))

  console.log()

  // Request Withdrawal
  console.log(`Withdraw 0.000000001 OAX...`)
  {
    const symbol = 'OAX'
    const token = config.assets[symbol]
    const amount = new BigNumber('0.000000001')

    console.log(`Amount to withdraw: ${amount}`)

    let requestSucceeded = false

    try {
      await exchangeClient.requestWithdrawal(token, amount)
      requestSucceeded = true
    } catch (err) {
      console.error(err)
    }

    if (requestSucceeded) {
      const currentBlock = await provider.getBlockNumber()
      const twoRounds = hubClient.roundSize.times(2).toNumber()

      console.log('Withdrawal successfully placed.')
      console.log(`Current block number: ${currentBlock}`)
      console.log(`Withdrawal ready after block number: ${currentBlock + twoRounds}`)
    }
  }

  console.log()

  // Confirm Withdrawal
  console.log('Confirming withdrawal...')
  {
    const symbol = 'OAX'
    const token = config.assets[symbol]
    await exchangeClient.confirmWithdrawal(token)
  }

  // Leaving Hub
  console.log('Leaving hub...')
  await exchangeClient.leave()
  console.log('Done')
}

class ApplicationError extends Error {
  constructor(message) {
    super(message)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

function loadConfig() {
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE))

  if (!config.hubUrl) {
    throw new ApplicationError(
      'config.json does not contain a hubUrl declaration.'
    )
  }

  if (!config.providerUrl) {
    throw new ApplicationError(
      'config.json does not contain a providerUrl declaration.'
    )
  }

  if (!config.operatorAddress) {
    throw new ApplicationError(
      'config.json does not contain a operatorAddress declaration.'
    )
  }

  if (!config.mediatorAddress) {
    throw new ApplicationError(
      'config.json does not contain a mediatorAddress declaration.'
    )
  }

  if (!config.assets) {
    throw new ApplicationError(
      'config.json does not contain an assets declaration.'
    )
  }

  return config
}

function saveConfig(config) {
  console.log('Saving to config file...')
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 4))
}
