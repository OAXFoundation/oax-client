const Path = require('path')

exports.Client = require('./Client').Client
exports.BaseExchangeClient = require('./exchange/BaseExchangeClient').BaseExchangeClient
exports.PrivateKeyIdentity = require('./identity/PrivateKeyIdentity').PrivateKeyIdentity
exports.AssetRegistry = require('./AssetRegistry').AssetRegistry
exports.ContractsPath = Path.join(__dirname, 'build/contracts')
