pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract EthStore is Ownable {

  using SafeMath for uint256;

  event NewStore(uint256 id, address storeOwner, bool enabled, string name, string imageUrl, uint256 productCount);
  event NewProduct(uint256 id, uint256 storeId, uint256 price, uint256 count, bool enabled, string name, string imageUrl);
  event NewTransaction(address buyer, uint256 productId, uint256 price);

  struct Store {
    uint256 id;
    address storeOwner;
    bool enabled;
    string name;
    string imageUrl;
    uint256 productCount;
  }

  struct Product {
    uint256 id;
    uint256 storeId;
    uint256 price;
    uint256 count;
    bool enabled;
    string name;
    string imageUrl;
  }

  mapping(address => uint256) public addressToBalance;
  mapping (address => uint256) public storeOwnerToStoreId;
  mapping (uint256 => uint256[]) public storeIdToProductIds;
  uint256 public storeCount = 0;
  uint256 public productCount = 0;
  Store[] public stores;
  Product[] public products;

  constructor() public {
    createStore(msg.sender);
    editStore("First EthStore", "https://binatir.com/assets/customised/avatar-kk.jpg");
    addProduct("EthStore Item 1", "https://binatir.com/assets/customised/avatar-kk.jpg", 5 ether, 1);
    addProduct("EthStore Item 2", "https://binatir.com/assets/customised/avatar-kk.jpg", 5 ether, 2);
  }

  modifier onlyStoreOwner() {
    uint256 storeId = storeOwnerToStoreId[msg.sender];
    require(storeId >= 0 && storeId < storeCount);
    require(stores[storeId].enabled);
    _;
  }

  function createStore(address _storeOwner) public onlyOwner {
    // create a store for the store owner
    storeOwnerToStoreId[_storeOwner] = storeCount;
    storeCount = stores.push(Store(storeCount, _storeOwner, true, "", "", 0));
    Store storage store = stores[storeCount.sub(1)];
    emit NewStore(store.id, store.storeOwner, store.enabled, store.name, store.imageUrl, store.productCount);
  }

  function editStore(string _name, string _imageUrl) public onlyStoreOwner {
    Store storage store = stores[storeOwnerToStoreId[msg.sender]];
    store.name = _name;
    store.imageUrl = _imageUrl;
  }

  function enableStore(uint256 _storeId, bool _enabled) public onlyOwner {
    Store storage store = stores[_storeId];
    store.enabled = _enabled;
  }

  function addProduct(string _name, string _imageUrl, uint256 _price, uint256 _count) public onlyStoreOwner {
    Store storage store = stores[storeOwnerToStoreId[msg.sender]];
    storeIdToProductIds[store.id].push(productCount);
    productCount = products.push(Product(productCount, store.id, _price, _count, true, _name, _imageUrl));
    store.productCount = store.productCount.add(1);
    Product storage product = products[productCount.sub(1)];
    emit NewProduct(product.id, product.storeId, product.price, product.count, product.enabled, product.name, product.imageUrl);
  }

  function editProduct(uint256 _productId, string _name, string _imageUrl, uint256 _price, uint256 _count) public onlyStoreOwner {
    Store storage store = stores[storeOwnerToStoreId[msg.sender]];
    Product storage product = products[_productId];
    require(product.storeId == store.id);
    product.name = _name;
    product.imageUrl = _imageUrl;
    product.price = _price;
    product.count = _count;
  }

  function enableProduct(uint256 _productId, bool _enabled) public onlyOwner {
    Product storage product = products[_productId];
    product.enabled = _enabled;
  }

  function purchaseProduct(uint256 _productId) public payable {
    require(_productId >= 0 && _productId < productCount);
    Product storage product = products[_productId];
    require(product.enabled);
    require(msg.value >= product.price);
    require(product.count > 0);
    Store storage store = stores[product.storeId];
    product.count = product.count.sub(1);
    addressToBalance[store.storeOwner] = addressToBalance[store.storeOwner].add(product.price);
    // refund extra amount
    if (msg.value > product.price) {
      msg.sender.transfer(msg.value.sub(product.price));
    }
    emit NewTransaction(msg.sender, product.id, product.price);
  }

  function withdrawBalance() public {
    uint256 amount = addressToBalance[msg.sender];
    addressToBalance[msg.sender] = 0;
    msg.sender.transfer(amount);
  }

}