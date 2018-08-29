/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require('truffle-hdwallet-provider')

const mnemonic = 'cover tone pact voice neglect fiscal make notice recipe purchase buyer once'
const rinkebyInfuraUrl = 'https://rinkeby.infura.io/v3/6063611c5f7b4a2f974eb257e1b259a4'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      gas: 6500000,
      gasPrice: 20000000000,
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, rinkebyInfuraUrl),
      network_id: '4',
      from: '0x8F23F4D600a13248de5a091dC5fC9e273274e344'.toLowerCase(),
      gas: 5000000,
      gasPrice: 20000000000,
    },
  },
}

