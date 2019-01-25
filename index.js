// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------

const Path = require('path')

exports.Client = require('./src/Client').Client
exports.BaseExchangeClient = require('./src/exchange/BaseExchangeClient').BaseExchangeClient
exports.PrivateKeyIdentity = require('./src/identity/PrivateKeyIdentity').PrivateKeyIdentity
exports.AssetRegistry = require('./src/AssetRegistry').AssetRegistry
exports.ContractsPath = Path.join(__dirname, 'build/contracts')
