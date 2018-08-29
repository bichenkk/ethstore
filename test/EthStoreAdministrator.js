/* eslint-disable */

const EthStoreAdministrator = artifacts.require('./EthStoreAdministrator.sol')
const BigNumber = require('bignumber.js')
const crypto = require('crypto')

const fromUIntToEther = (value) => {
  return web3.fromWei(value.toNumber(), 'ether' )
}

const getEtherBalance = async (address) => {
  const balance = await web3.eth.getBalance(address)
  return fromUIntToEther(balance)
}

contract('EthStoreAdministrator', (accounts) => {
  const creator = accounts[0]
  const storeOwner = accounts[1]
  const normalUser = accounts[2]

  it('should be able to create a store for the store owner', async () => {
    const instanceEthStoreAdministrator = await EthStoreAdministrator.new()
    await instanceEthStoreAdministrator.createStore(storeOwner)
    const storeId = await instanceEthStoreAdministrator.storeOwnerToStoreId(storeOwner)
    const storeValues = await instanceEthStoreAdministrator.stores(storeId - 1)
    const storeOwnerValue = storeValues[1]
    assert.equal(storeOwnerValue, storeOwner, 'The store owner addresses are not identical')
  })

  it('should fail if a normal user creates a store', async () => {
    try {
      const instanceEthStoreAdministrator = await EthStoreAdministrator.new()
      await instanceEthStoreAdministrator.createStore.call(normalUser, {from: normalUser})
      assert.fail(null, null, 'There should be VM exception')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to disable a store by creator', async () => {
    const instanceEthStoreAdministrator = await EthStoreAdministrator.new()
    await instanceEthStoreAdministrator.createStore(storeOwner)
    const storeId = await instanceEthStoreAdministrator.storeOwnerToStoreId(storeOwner)
    const oldStoreValues = await instanceEthStoreAdministrator.stores(storeId - 1)
    const oldStoreEnabled = oldStoreValues[2]
    await instanceEthStoreAdministrator.enableStore(storeId, false)
    const newStoreValues = await instanceEthStoreAdministrator.stores(storeId - 1)
    const newStoreEnabled = newStoreValues[2]
    assert.notEqual(newStoreEnabled, oldStoreEnabled, 'The store enabled is not changed.')
    assert.equal(newStoreEnabled, false, 'The store is not disabled.')
  })

  it('should fail if a normal user disable a store', async () => {
    try {
      const instanceEthStoreAdministrator = await EthStoreAdministrator.new()
      await instanceEthStoreAdministrator.createStore(storeOwner)
      const storeId = await instanceEthStoreAdministrator.storeOwnerToStoreId(storeOwner)
      await instanceEthStoreAdministrator.enableStore(storeId, false, { from: normalUser })
      assert.fail(null, null, 'There should be VM exception')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to disable a product by creator', async () => {
    const instanceEthStoreAdministrator = await EthStoreAdministrator.new()
    const productId = 1
    const oldProductValues = await instanceEthStoreAdministrator.products(productId - 1)
    const oldProductEnabled = oldProductValues[4]
    await instanceEthStoreAdministrator.enableProduct(productId, false)
    const newProductValues = await instanceEthStoreAdministrator.products(productId - 1)
    const newProductEnabled = newProductValues[4]
    assert.notEqual(newProductEnabled, oldProductEnabled, 'The product enabled is not changed.')
    assert.equal(newProductEnabled, false, 'The product is not disabled.')
  })

  it('should fail if a normal user disable a product', async () => {
    try {
      const instanceEthStoreAdministrator = await EthStoreAdministrator.new()
      const productId = 1
      const oldProductValues = await instanceEthStoreAdministrator.products(productId - 1)
      const oldProductEnabled = oldProductValues[4]
      await instanceEthStoreAdministrator.enableProduct(productId, false, { from: normalUser })
      assert.fail(null, null, 'There should be VM exception')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

})
