/* eslint-disable */

const EthStoreStoreOwner = artifacts.require('./EthStoreStoreOwner.sol')
const BigNumber = require('bignumber.js')
const crypto = require('crypto')

const fromUIntToEther = (value) => {
  return web3.fromWei(value.toNumber(), 'ether' )
}

const getEtherBalance = async (address) => {
  const balance = await web3.eth.getBalance(address)
  return fromUIntToEther(balance)
}

contract('EthStoreStoreOwner', (accounts) => {
  const creator = accounts[0]
  const storeOwner = accounts[1]
  const normalUser = accounts[2]

  it('should be able to edit store by the store owner', async () => {
    const instanceEthStoreStoreOwner = await EthStoreStoreOwner.new()
    await instanceEthStoreStoreOwner.createStore(storeOwner)
    const storeId = await instanceEthStoreStoreOwner.storeOwnerToStoreId(storeOwner)
    const oldStoreValues = await instanceEthStoreStoreOwner.stores(storeId - 1)
    const oldStoreName = oldStoreValues[3]
    const oldStoreDescription = oldStoreValues[5]
    const newName = crypto.randomBytes(20).toString('hex')
    const newUrl = crypto.randomBytes(20).toString('hex')
    await instanceEthStoreStoreOwner.editStore(newName, "", newUrl, { from: storeOwner })
    const newStoreValues = await instanceEthStoreStoreOwner.stores(storeId - 1)
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

  it('should fail if a normal user tries to edit a store', async () => {
    try {
      const instanceEthStoreStoreOwner = await EthStoreStoreOwner.new()
      await instanceEthStoreStoreOwner.createStore(storeOwner)
      await instanceEthStoreStoreOwner.editStore.call('NAME', 'URL', { from: normalUser })
      assert.fail(null, null, 'There should be VM exception')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to edit product by the store owner', async () => {
    const instanceEthStoreStoreOwner = await EthStoreStoreOwner.new()
    await instanceEthStoreStoreOwner.createStore(storeOwner)
    const storeId = await instanceEthStoreStoreOwner.storeOwnerToStoreId(storeOwner)
    await instanceEthStoreStoreOwner.addProduct("My Product 1", "", "", web3.toWei(10), 15, { from: storeOwner })
    const store = await instanceEthStoreStoreOwner.stores(storeId - 1)
    const storeProductCount = store.productCount
    const productId = await instanceEthStoreStoreOwner.storeIdToProductIds(storeId, storeProductCount - 1)
    const oldProductValues = await instanceEthStoreStoreOwner.products(productId - 1)
    const oldProductPrice = oldProductValues[2]
    const oldProductCount = oldProductValues[3]
    const newPrice = web3.toWei(15)
    const newCount = 20
    await instanceEthStoreStoreOwner.editProduct(productId, "", "", "", newPrice, newCount, { from: storeOwner })
    const newProductValues = await instanceEthStoreStoreOwner.products(productId - 1)
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

  it('should fail if a normal user tries to edit a product', async () => {
    try {
      const instanceEthStoreStoreOwner = await EthStoreStoreOwner.new()
      await instanceEthStoreStoreOwner.createStore(storeOwner)
      const storeId = await instanceEthStoreStoreOwner.storeOwnerToStoreId(storeOwner)
      await instanceEthStoreStoreOwner.addProduct("My Product 1", "", "", web3.toWei(10), 15, { from: storeOwner })
      const store = await instanceEthStoreStoreOwner.stores(storeId - 1)
      const storeProductCount = store.productCount
      const productId = await instanceEthStoreStoreOwner.storeIdToProductIds(storeId, storeProductCount - 1)
      const oldProductValues = await instanceEthStoreStoreOwner.products(productId - 1)
      const oldProductPrice = oldProductValues[2]
      const oldProductCount = oldProductValues[3]
      const newPrice = web3.toWei(15)
      const newCount = 20
      await instanceEthStoreStoreOwner.editProduct(productId, "", "", "", newPrice, newCount, { from: normalUser })
      assert.fail(null, null, 'There should be VM exception')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to let store owner withdraw the balances', async () => {
    const instance = await EthStoreStoreOwner.new()
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

})
