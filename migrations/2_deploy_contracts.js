var EthStoreBase = artifacts.require("./EthStoreBase.sol")
var EthStoreSample = artifacts.require("./EthStoreSample.sol")
var EthStoreStoreOwner = artifacts.require("./EthStoreStoreOwner.sol")
var EthStoreAdministrator = artifacts.require("./EthStoreAdministrator.sol")
var EthStore = artifacts.require("./EthStore.sol")

module.exports = function (deployer) {
  deployer.deploy(EthStoreBase)
  deployer.deploy(EthStoreSample)
  deployer.deploy(EthStoreAdministrator)
  deployer.deploy(EthStoreStoreOwner)
  deployer.deploy(EthStore)
}
