var EthStore = artifacts.require('./EthStore.sol')

module.exports = function (deployer) {
  deployer.deploy(EthStore)
}
