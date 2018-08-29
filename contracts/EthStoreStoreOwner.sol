pragma solidity ^0.4.23;

import "./EthStoreAdministrator.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/** @title The EthStore store-owner-related functions */
contract EthStoreStoreOwner is EthStoreAdministrator {

  /** @dev Check if the address has an enabled store.
    */
  modifier onlyStoreOwner() {
    uint256 storeId = storeOwnerToStoreId[msg.sender];
    require(storeId > 0 && storeId <= storeCount && stores[storeId.sub(1)].enabled);
    _;
  }

  /** @dev Edit a store.
    * @param _name The name of the store.
    * @param _description The description of the store.
    * @param _imageUrl The image url of the store.
    */
  function editStore(string _name, string _description, string _imageUrl) public onlyStoreOwner {
    Store storage store = stores[storeOwnerToStoreId[msg.sender].sub(1)];
    store.name = _name;
    store.description = _description;
    store.imageUrl = _imageUrl;
  }

  /** @dev Add a product to the store of msg.sender.
    * @param _name The name of the product.
    * @param _description The description of the product.
    * @param _imageUrl The image url of the product.
    * @param _price The price of the product.
    * @param _count The number of inventory.
    */
  function addProduct(string _name, string _description, string _imageUrl, uint256 _price, uint256 _count) public onlyStoreOwner {
    uint256 storeId = storeOwnerToStoreId[msg.sender];
    Store storage store = stores[storeId.sub(1)];
    uint256 productId = productCount.add(1);
    storeIdToProductIds[store.id].push(productId);
    productCount = products.push(Product(productId, store.id, _price, _count, true, _name, _description, _imageUrl));
    store.productCount = store.productCount.add(1);
    emit NewProduct(productId, store.id);
  }

  /** @dev Edit a product.
    * @param _productId The id of the product.
    * @param _name The name of the product.
    * @param _description The description of the product.
    * @param _imageUrl The image url of the product.
    * @param _price The price of the product.
    * @param _count The number of inventory.
    */
  function editProduct(uint256 _productId, string _name, string _description, string _imageUrl, uint256 _price, uint256 _count) public onlyStoreOwner {
    require(_productId > 0 && _productId <= productCount);
    uint256 storeId = storeOwnerToStoreId[msg.sender];
    Store storage store = stores[storeId.sub(1)];
    Product storage product = products[_productId.sub(1)];
    require(product.storeId == store.id);
    product.name = _name;
    product.description = _description;
    product.imageUrl = _imageUrl;
    product.price = _price;
    product.count = _count;
  }

}