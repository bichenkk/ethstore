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

contract('EthStore => EthStoreSample => EthStoreBase', (accounts) => {
  const creator = accounts[0]
  const normalUser = accounts[2]

  it('should have the owner as the contract creator', async () => {
    const instance = await EthStore.new()
    const owner = await instance.owner()
    assert.equal(creator, owner, 'The addresses are not identical')
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

  it('should be able to check the identity of an user', async () => {
    const instance = await EthStore.new()
    const creatorResult = await instance.getIdentity()
    assert.equal(creatorResult[0], true, 'The creator does not have administrator identity.')
    assert.equal(creatorResult[1], true, 'The creator does not have store owner identity.')
    const normalUserResult = await instance.getIdentity({ from: normalUser })
    assert.equal(normalUserResult[0], false, 'The normal user has administrator identity.')
    assert.equal(normalUserResult[1], false, 'The normal user has store owner identity.')
  })

  it('should be able to pause purchase when the contract is emergency stopped', async () => {
    try {
      const instance = await EthStore.new()
      const productValues = await instance.products(0)
      const productId = productValues[0]
      await instance.pause()
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
      await instance.pause()
      await instance.withdrawBalance()
      assert.fail(null, null, 'It is not stopped.')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

  it('should be able to pause by creator only', async () => {
    try {
      const instance = await EthStore.new()
      await instance.pause({ from: normalUser })
      assert.fail(null, null, 'It is not stopped.')
    } catch (e) {
      // console.log('error', e.message)
    }
  })

})
