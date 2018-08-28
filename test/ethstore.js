/* eslint-disable */

const EthStore = artifacts.require('./EthStore.sol')
const BigNumber = require('bignumber.js')
const crypto = require('crypto')

const fromUIntToEther = (value) => {
  return web3.fromWei(value.toNumber(), 'ether' )
}

const getEtherBalance = async (address) => {
  const balance = await web3.eth.getBalance(address)
  return fromUIntToEther(balance)
}

contract('EthStore', (accounts) => {
  const creator = accounts[0]
  const storeOwner = accounts[1]
  const normalUser = accounts[2]

  it('should have the owner as the contract creator', async () => {
    const instance = await EthStore.new()
    const owner = await instance.owner()
    assert.equal(creator, owner, 'The addresses are not identical')
  })

  it('should be able to create a store for the store owner', async () => {
    const instance = await EthStore.new()
    await instance.createStore(storeOwner)
    const storeId = await instance.storeOwnerToStoreId(storeOwner)
    const storeValues = await instance.stores(storeId - 1)
    const storeOwnerValue = storeValues[1]
    assert.equal(storeOwnerValue, storeOwner, 'The store owner addresses are not identical')
  })

  it('should fail if a normal user creates a store', async () => {
    try {
      const instance = await EthStore.new()
      await instance.createStore.call(normalUser, {from: normalUser})
      assert.fail(null, null, 'There should be VM exception')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to edit store by the store owner', async () => {
    const instance = await EthStore.new()
    await instance.createStore(storeOwner)
    const storeId = await instance.storeOwnerToStoreId(storeOwner)
    const oldStoreValues = await instance.stores(storeId - 1)
    const oldStoreName = oldStoreValues[3]
    const oldStoreDescription = oldStoreValues[5]
    const newName = crypto.randomBytes(20).toString('hex')
    const newUrl = crypto.randomBytes(20).toString('hex')
    await instance.editStore(newName, "", newUrl, { from: storeOwner })
    const newStoreValues = await instance.stores(storeId - 1)
    const newStoreName = newStoreValues[3]
    const newStoreDescription = newStoreValues[5]
    // console.log('oldStoreName', oldStoreName)
    // console.log('oldStoreDescription', oldStoreDescription)
    // console.log('newName', newName)
    // console.log('newUrl', newUrl)
    // console.log('newStoreName', newStoreName)
    // console.log('newStoreDescription', newStoreDescription)
    assert.notEqual(newStoreName, oldStoreName, 'The store name is not changed.')
    assert.notEqual(newStoreDescription, oldStoreDescription, 'The store image url is not changed.')
    assert.equal(newStoreName, newName, 'The store name is not changed.')
    assert.equal(newStoreDescription, newUrl, 'The store image url is not changed.')
  })

  it('should fail if a normal user tries to edit his/her store', async () => {
    try {
      const instance = await EthStore.new()
      await instance.createStore(storeOwner)
      await instance.editStore.call('NAME', 'URL', { from: normalUser })
      assert.fail(null, null, 'There should be VM exception')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to disable a store by creator', async () => {
    const instance = await EthStore.new()
    await instance.createStore(storeOwner)
    const storeId = await instance.storeOwnerToStoreId(storeOwner)
    const oldStoreValues = await instance.stores(storeId - 1)
    const oldStoreEnabled = oldStoreValues[2]
    await instance.enableStore(storeId, false)
    const newStoreValues = await instance.stores(storeId - 1)
    const newStoreEnabled = newStoreValues[2]
    assert.notEqual(newStoreEnabled, oldStoreEnabled, 'The store enabled is not changed.')
    assert.equal(newStoreEnabled, false, 'The store is not disabled.')
  })

  it('should be able to make purchase of product', async () => {
    const instance = await EthStore.new()
    const storeId = await instance.storeOwnerToStoreId(creator)
    const user3BalanceBeforePurchase = await getEtherBalance(normalUser)
    const contractBalanceBeforePurchase = await getEtherBalance(instance.address)
    const productValues = await instance.products(0)
    const productPrice = fromUIntToEther(productValues[2])
    const productId = productValues[0]
    await instance.purchaseProduct(productId, { value: web3.toWei(15), from: normalUser })
    const user3BalanceAfterPurchase = await getEtherBalance(normalUser)
    const contractBalanceAfterPurchase = await getEtherBalance(instance.address)
    const creatorContractBalance = await instance.addressToBalance(creator)
    // console.log('user3BalanceBeforePurchase', user3BalanceBeforePurchase)
    // console.log('contractBalanceBeforePurchase', contractBalanceBeforePurchase)
    // console.log('product price', productPrice)
    // console.log('user3BalanceAfterPurchase', user3BalanceAfterPurchase)
    // console.log('contractBalanceAfterPurchase', contractBalanceAfterPurchase)
    // console.log('creatorContractBalance', fromUIntToEther(creatorContractBalance))
    const transactionId = await instance.transactionCount()
    const transactionValues = await instance.transactions(transactionId - 1)
    const buyer = transactionValues[4]
    assert.equal(buyer, normalUser, 'The transaction records does not match.')
    assert.equal(productPrice, contractBalanceAfterPurchase, 'The gain is not equal to the product price.')
    assert.equal(productPrice, fromUIntToEther(creatorContractBalance), 'The gain is not equal to the product price.')
  })

  it('should be able to let store owner withdraw the balances', async () => {
    const instance = await EthStore.new()
    const storeId = await instance.storeOwnerToStoreId(creator)
    const creatorBalanceBeforePurchase = await web3.eth.getBalance(creator)
    const productValues = await instance.products(0)
    const productPrice = productValues[2]
    const productId = productValues[0]
    await instance.purchaseProduct(productId, { value: web3.toWei(10), from: normalUser })
    const contractBalanceAfterPurchase = await web3.eth.getBalance(instance.address)
    const creatorContractBalanceAfterPurchase = await instance.addressToBalance(creator)
    const creatorBalanceAfterPurchase = await web3.eth.getBalance(creator)
    const withdrawBalanceTransaction = await instance.withdrawBalance()
    const withdrawBalanceTx = await web3.eth.getTransaction(withdrawBalanceTransaction.tx);
    const withdrawBalanceTransactionGasPrice = withdrawBalanceTx.gasPrice;
    const withdrawBalanceTransactionGasUsed = withdrawBalanceTransaction.receipt.gasUsed
    const withdrawBalanceTransactionEtherUsed = withdrawBalanceTransactionGasPrice.times(withdrawBalanceTransactionGasUsed)
    const contractBalanceAfterWithdrawal = await web3.eth.getBalance(instance.address)
    const creatorContractBalanceAfterWithdrawal = await instance.addressToBalance(creator)
    const creatorBalanceAfterWithdrawal = await web3.eth.getBalance(creator)
    const difference = creatorBalanceAfterWithdrawal.plus(withdrawBalanceTransactionEtherUsed).minus(creatorBalanceBeforePurchase)
    // console.log('creatorBalanceBeforePurchase', creatorBalanceBeforePurchase)
    // console.log('product price', productPrice)
    // console.log('contractBalanceAfterPurchase', contractBalanceAfterPurchase)
    // console.log('creatorContractBalanceAfterPurchase', fromUIntToEther(creatorContractBalanceAfterPurchase))
    // console.log('creatorBalanceAfterPurchase', creatorBalanceAfterPurchase)
    // console.log('withdrawBalanceTransactionEtherUsed', withdrawBalanceTransactionEtherUsed)
    // console.log('contractBalanceAfterWithdrawal', contractBalanceAfterWithdrawal)
    // console.log('creatorContractBalanceAfterWithdrawal', fromUIntToEther(creatorContractBalanceAfterWithdrawal))
    // console.log('creatorBalanceAfterWithdrawal', creatorBalanceAfterWithdrawal)
    // console.log('difference', difference)
    assert.isOk(new BigNumber(difference).isEqualTo(new BigNumber(productPrice)), 'The withdrawal is not equal to the product price.')
  })

  it('should be able to edit product by the store owner', async () => {
    const instance = await EthStore.new()
    await instance.createStore(storeOwner)
    const storeId = await instance.storeOwnerToStoreId(storeOwner)
    await instance.addProduct("My Product 1", "", "", web3.toWei(10), 15, { from: storeOwner })
    const store = await instance.stores(storeId - 1)
    const storeProductCount = store.productCount
    const productId = await instance.storeIdToProductIds(storeId, storeProductCount - 1)
    const oldProductValues = await instance.products(productId - 1)
    const oldProductPrice = oldProductValues[2]
    const oldProductCount = oldProductValues[3]
    const newPrice = web3.toWei(15)
    const newCount = 20
    await instance.editProduct(productId, "", "", "", newPrice, newCount, { from: storeOwner })
    const newProductValues = await instance.products(productId - 1)
    const newProductPrice = newProductValues[2]
    const newProductCount = newProductValues[3]
    // console.log('oldProductPrice', fromUIntToEther(oldProductPrice))
    // console.log('oldProductCount', oldProductCount.toNumber())
    // console.log('newProductPrice', fromUIntToEther(newProductPrice))
    // console.log('newProductCount', newProductCount.toNumber())
    assert.notEqual(newProductPrice, oldProductPrice, 'The product price is not changed.')
    assert.notEqual(newProductCount, oldProductCount, 'The product count is not changed.')
    assert.equal(newProductPrice, newPrice, 'The product price is not changed.')
    assert.equal(newProductCount, newCount, 'The product count is not changed.')
  })

  it('should be able to disable a product by creator', async () => {
    const instance = await EthStore.new()
    await instance.createStore(storeOwner)
    const storeId = await instance.storeOwnerToStoreId(storeOwner)
    await instance.addProduct("My Product 1", "", "", web3.toWei(10), 15, { from: storeOwner })
    const store = await instance.stores(storeId - 1)
    const storeProductCount = store.productCount
    const productId = await instance.storeIdToProductIds(storeId, storeProductCount - 1)
    const oldProductValues = await instance.products(productId - 1)
    const oldProductEnabled = oldProductValues[4]
    await instance.enableProduct(productId, false)
    const newProductValues = await instance.products(productId - 1)
    const newProductEnabled = newProductValues[4]
    assert.notEqual(newProductEnabled, oldProductEnabled, 'The product enabled is not changed.')
    assert.equal(newProductEnabled, false, 'The product is not disabled.')
  })

  it('should be able to check the identity of an user', async () => {
    const instance = await EthStore.new()
    await instance.createStore(storeOwner)
    await instance.storeOwnerToStoreId(storeOwner)
    const creatorResult = await instance.getIdentity()
    const storeOwnerResult = await instance.getIdentity({ from: storeOwner })
    const normalUserResult = await instance.getIdentity({ from: normalUser })
    assert.equal(creatorResult[0], true, 'The creator does not have administrator identity.')
    assert.equal(creatorResult[1], true, 'The creator does not have store owner identity.')
    assert.equal(storeOwnerResult[0], false, 'The store owner has administrator identity.')
    assert.equal(storeOwnerResult[1], true, 'The store owner does not have store owner identity.')
    assert.equal(normalUserResult[0], false, 'The normal user has administrator identity.')
    assert.equal(normalUserResult[1], false, 'The normal user has store owner identity.')
  })

  it('should be able to pause purchase when the contract is emergency stopped', async () => {
    try {
      const instance = await EthStore.new()
      const productValues = await instance.products(0)
      const productId = productValues[0]
      await instance.stopContract()
      await instance.purchaseProduct(productId, { value: web3.toWei(15), from: normalUser })
      assert.fail(null, null, 'It is not stopped.')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to pause withdrawal when the contract is emergency stopped', async () => {
    try {
      const instance = await EthStore.new()
      const storeId = await instance.storeOwnerToStoreId(creator)
      const creatorBalanceBeforePurchase = await web3.eth.getBalance(creator)
      const productValues = await instance.products(0)
      const productPrice = productValues[2]
      const productId = productValues[0]
      await instance.purchaseProduct(productId, { value: web3.toWei(10), from: normalUser })
      await instance.stopContract()
      await instance.withdrawBalance()
      assert.fail(null, null, 'It is not stopped.')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to pause by creator', async () => {
    try {
      const instance = await EthStore.new()
      await instance.stopContract({ from: normalUser })
      assert.fail(null, null, 'It is not stopped.')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  // it('testing', async () => {
  //   const instance = await EthStore.new()
  // })

})
