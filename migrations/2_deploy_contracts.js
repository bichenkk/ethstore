var EthStore = artifacts.require("./EthStore.sol")
var EthStoreStoreOwner = artifacts.require("./EthStoreStoreOwner.sol")
var EthStoreAdministrator = artifacts.require("./EthStoreAdministrator.sol")
var EthStoreSampleStore1 = artifacts.require("./EthStoreSampleStore1.sol")
var EthStoreSampleStore2 = artifacts.require("./EthStoreSampleStore2.sol")

module.exports = function (deployer) {
  deployer.deploy(EthStore)
  deployer.deploy(EthStoreStoreOwner)
  deployer.deploy(EthStoreAdministrator)
  deployer.deploy(EthStoreSampleStore1)
  deployer.deploy(EthStoreSampleStore2)
}
