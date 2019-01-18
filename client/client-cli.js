#!/usr/bin/env node
const fs = require('fs')
const Path = require('path')
const Minimist = require('minimist')
const BigNumber = require('bignumber.js')
const Colors = require('colors/safe')
const Ethers = require('ethers')
const Providers = require('ethers/providers')
const Client = require(Path.join(__dirname, '..', 'client'))
const ShellParse = require('shell-quote').parse

async function run() {
  const stdInText = await require('get-stdin')()

  var argvList = []
  var isBatch = false
  if (stdInText !== '') {
    const cmdLines = stdInText.split('\n')

    for (var i = 0; i < cmdLines.length; i++) {
      const cmdLine = cmdLines[i].trim()

      if (cmdLine === '') {
        continue
      }

      const argv = ShellParse(cmdLine)
      argvList.push(Minimist(argv, { string: ['_'] }))
    }

    isBatch = true
  } else {
    argvList.push(Minimist(process.argv.slice(2), { string: ['_'] }))
  }

  if (argvList[0]['init']) {
    createConfigFile()
    return
  }

  // Load config
  const config = loadConfig()

  // Load state
  const state = {} //loadState()

  // Load Wallet
  const wallet = loadWallet(config)

  var client = null
  try {
    for (var i = 0; i < argvList.length; i++) {
      const argv = argvList[i]

      // Parse command
      const cmd = parseCommand(argv)

      if (cmd.offline) {
        await executeCommand(config, wallet, null, cmd, isBatch)
        continue
      }

      if (client === null) {
        // Load client
        client = loadClient(config, state, wallet)

        // Join Hub
        console.log('Connecting...')
        await client.join()
        //saveState(client)
      }

      // Execute Command
      await executeCommand(config, wallet, client, cmd, isBatch)
    }
  } finally {
    if (client !== null) {
      try {
        await client.leave()
      } catch (e) {}
    }
  }
}

function parseCommand(argv) {
  const name = argv._[0]

  if (!name) {
    printHelp()
    process.exit(1)
  }

  var cmd = {}
  var pair = null
  var amount = null
  var symbol = null

  switch (name) {
    case 'getWalletAddress':
      cmd.offline = true
      break
    case 'buyWETH':
      amount = argv._[1]
      if (!amount) {
        throw new ApplicaitonError('No amount specified.')
      }
      cmd.args = [amount]
      break
    case 'fetchBalances':
    case 'fetchOrders':
      break
    case 'fetchOrder':
      const id = argv._[1]
      if (!id) {
        throw new ApplicationError('No order id specified.')
      }
      cmd.args = [id]
      break
    case 'fetchOrderBook':
    case 'fetchTrades':
      pair = argv._[1]
      if (!pair) {
        throw new ApplicationError('No trading pair specified.')
      }
      cmd.args = [pair]
      break
    case 'createOrder':
      const side = argv._[1]
      if (!side) {
        throw new ApplicationError('No side specified.')
      }
      if (side !== 'BUY' && side !== 'SELL') {
        throw new ApplicationError('Invalid side specified')
      }
      pair = argv._[2]
      if (!pair) {
        throw new ApplicationError('No pair specified.')
      }
      amount = new BigNumber(argv._[3])
      const price = new BigNumber(argv._[4])
      cmd.args = [side, pair, amount, price]
      break
    case 'deposit':
    case 'requestWithdrawal':
      symbol = argv._[1]
      if (!symbol) {
        throw new ApplicationError('No symbol specified.')
      }
      amount = new BigNumber(argv._[2])
      cmd.args = [symbol, amount]
      break
    case 'confirmWithdrawal':
      symbol = argv._[1]
      if (!symbol) {
        throw new ApplicationError('No symbol specified.')
      }
      cmd.args = [symbol]
      break
    case 'fetchWalletBalance':
      symbol = argv._[1]
      if (!symbol) {
        throw new ApplicationError('No symbol specified.')
      }
      cmd.args = [symbol]
      break
    default:
      throw new ApplicationError("Invalid command '" + name + "'")
  }

  cmd.name = name
  cmd.display = argv._.join(' ')
  cmd.handler = eval(name)

  return cmd
}

async function executeCommand(config, wallet, client, cmd, isBatch) {
  var args = [
    {
      config: config,
      wallet: wallet,
      client: client
    }
  ]

  args = args.concat(cmd.args)

  if (isBatch) {
    console.log('> ' + cmd.display)
  }

  await cmd.handler(...args)
  console.log('')
}

function loadConfig() {
  if (!fs.existsSync('config.json')) {
    throw new ApplicationError('Expected a config.json file with hub URL.')
  }

  const config = JSON.parse(fs.readFileSync('config.json'))

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

function loadWallet(config) {
  var wallet = null

  if (config.walletMnemonic) {
    wallet = Ethers.Wallet.fromMnemonic(config.walletMnemonic)
  } else {
    wallet = Ethers.Wallet.createRandom()

    config.walletMnemonic = wallet.mnemonic

    fs.writeFileSync('config.json', JSON.stringify(config, null, 4))

    console.log('Created new wallet. Address: ' + wallet.address)
  }

  return wallet
}

function loadState() {
  let state

  try {
    state = JSON.parse(fs.readFileSync('state.json'))
  } catch (err) {
    state = {}
  }

  return state
}

function saveState(client) {
  const state = {
    roundJoined: client.roundJoined
  }

  fs.writeFileSync('state.json', JSON.stringify(state, null, 4))

  console.log('State saved')
}

function loadClient(config, state, wallet) {
  const provider = new Providers.JsonRpcProvider(config.providerUrl)
  const identity = new Client.PrivateKeyIdentity(wallet.privateKey, provider)

  const hubClient = new Client.Client(
    Object.values(config.assets),
    identity,
    config.hubUrl,
    {
      operatorAddress: config.operatorAddress,
      mediator: config.mediatorAddress
    }
  )

  hubClient.setState(state)

  const assetRegistry = new Client.AssetRegistry()
  const assetNames = Object.keys(config.assets)
  for (var i = 0; i < assetNames.length; i++) {
    const name = assetNames[i]
    const address = config.assets[name]

    assetRegistry.add(name, address)
  }

  return new Client.BaseExchangeClient(identity, hubClient, assetRegistry)
}

function createConfigFile() {
  const exampleConfigPath = Path.join(__dirname, 'config.example.json')
  const configPath = Path.resolve('config.json')

  if (fs.existsSync(configPath)) {
    console.log(`A 'config.json' file is already defined at: '${configPath}'`)
    process.exit(1)
  }

  const exampleConfig = fs.readFileSync(exampleConfigPath)
  fs.writeFileSync(configPath, exampleConfig)

  console.log('Successfully created a config.json file.')
}

async function getWalletAddress(ctx) {
  console.log(ctx.wallet.address)
}

async function buyWETH(ctx, amount) {
  const symbol = 'WETH'
  const wethAddr = ctx.config.assets[symbol]

  console.log(`Buying ${amount} WETH...`)

  const tx = await ctx.client.identity.sendTransaction({
    to: wethAddr,
    value: Ethers.utils.parseEther(amount)
  })
  await tx.wait()

  console.log(`Bought ${amount} WETH.`)
}

async function fetchWalletBalance(ctx, symbol) {
  const tokenAddress = ctx.config.assets[symbol]
  const provider = ctx.client.identity.provider

  const erc20Path = Path.join(Client.ContractsPath, 'erc20.abi')
  const erc20Abi = JSON.parse(fs.readFileSync(erc20Path))

  const contract = new Ethers.Contract(tokenAddress, erc20Abi, provider)

  const balanceInWei = await contract.balanceOf(ctx.wallet.address)
  const balance = Ethers.utils.formatEther(balanceInWei)

  console.log(`Balance: ${balance}`)
}

async function fetchBalances(ctx) {
  const balances = await ctx.client.fetchBalances()

  console.log(JSON.stringify(balances, null, 4))
}

async function fetchOrderBook(ctx, pair) {
  const orderBook = await ctx.client.fetchOrderBook(pair)

  console.log(JSON.stringify(orderBook, null, 4))
}

async function fetchTrades(ctx, pair) {
  const trades = await ctx.client.fetchTrades(pair)

  console.log(JSON.stringify(trades, null, 4))
}

async function fetchOrder(ctx, id) {
  const order = await ctx.client.fetchOrder(id)

  console.log(JSON.stringify(order, null, 4))
}

async function fetchOrders(ctx) {
  const orders = await ctx.client.fetchOrders()

  console.log(JSON.stringify(orders, null, 4))
}

async function createOrder(ctx, side, pair, amount, price) {
  console.log(
    'Placing order to ' +
      side +
      ' ' +
      amount.toString() +
      ' ' +
      pair +
      ' @ ' +
      price.toString() +
      '...'
  )
  const result = await ctx.client.createOrder(
    pair,
    'limit',
    side.toLowerCase(),
    amount,
    price
  )

  console.log('Order placed successfully.')
  console.log(JSON.stringify(result, null, 4))
}

async function deposit(ctx, symbol, amount) {
  const assetAddress = ctx.config.assets[symbol]

  if (!assetAddress) {
    throw new ApplicationError('Invalid symbol ' + symbol)
  }

  console.log('Depositing ' + amount.toString() + ' ' + symbol + '...')
  const result = await ctx.client.deposit(assetAddress, amount, true)

  console.log('Deposit completed successfully.')
  console.log(JSON.stringify(result, null, 4))
}

async function requestWithdrawal(ctx, symbol, amount) {
  const assetAddress = ctx.config.assets[symbol]

  if (!assetAddress) {
    throw new ApplicationError('Invalid symbol ' + symbol)
  }

  const result = await ctx.client.requestWithdrawal(assetAddress, amount)

  console.log(JSON.stringify(result, null, 4))
}

async function confirmWithdrawal(ctx, symbol) {
  const assetAddress = ctx.config.assets[symbol]

  if (!assetAddress) {
    throw new ApplicationError('Invalid symbol ' + symbol)
  }

  const result = await ctx.client.confirmWithdrawal(assetAddress)

  console.log(JSON.stringify(result, null, 4))
}

function printHelp() {
  console.log('USAGE')
  console.log('node cli.js [options] <command> [arguments]')
  console.log('')
  console.log('OPTIONS')
  console.log('--init')
  console.log('')
  console.log('COMMANDS')
  console.log('getWalletAddress')
  console.log('buyWETH <amount>')
  console.log('fetchBalances')
  console.log('fetchWalletBalance <symbol>')
  console.log('fetchOrderBook <pair>')
  console.log('fetchTrades <pair>')
  console.log('fetchOrder <id>')
  console.log('fetchOrders')
  console.log('createOrder <side> <pair> <amount> <price>')
  console.log('deposit <symbol> <amount>')
  console.log('requestWithdrawal <symbol> <amount>')
  console.log('confirmWithdrawal <symbol>')

  console.log('')
}

class ApplicationError extends Error {
  constructor(message) {
    super(message)
  }
}

run().catch(err => {
  if (err instanceof ApplicationError) {
    console.log(err.message)
  } else {
    console.log(err)
    process.exit(1)
  }
})
