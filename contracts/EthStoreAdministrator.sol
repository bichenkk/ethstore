pragma solidity ^0.4.23;

import "./EthStoreSample.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract EthStoreAdministrator is EthStoreSample {

  using SafeMath for uint256;

  /** @dev Create a new store.
    * @param _storeOwner The address of the store owner.
    */
  function createStore(address _storeOwner) public onlyOwner {
    require(storeOwnerToStoreId[_storeOwner] == 0);
    // create a store for the store owner
    uint256 storeId = storeCount.add(1);
    storeCount = stores.push(Store(storeId, _storeOwner, true, "", "", "", 0));
    storeOwnerToStoreId[_storeOwner] = storeId;
    emit NewStore(storeId, _storeOwner);
  }

  /** @dev Enable / disable a store.
    * @param _storeId The id of the store.
    * @param _enabled The flag of enabled.
    */
  function enableStore(uint256 _storeId, bool _enabled) public onlyOwner {
    require(_storeId > 0 && _storeId <= storeCount);
    Store storage store = stores[_storeId.sub(1)];
    store.enabled = _enabled;
  }

  /** @dev Enable / disable a product.
    * @param _productId The id of the product.
    * @param _enabled The flag of enabled.
    */
  function enableProduct(uint256 _productId, bool _enabled) public onlyOwner {
    require(_productId > 0 && _productId <= productCount);
    Product storage product = products[_productId.sub(1)];
    product.enabled = _enabled;
  }

}