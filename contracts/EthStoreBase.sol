pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/** @title The EthStore data structures and core functions */
contract EthStoreBase is Ownable, Pausable {

  using SafeMath for uint256;

  event NewStore(uint256 id, address storeOwner);
  event NewProduct(uint256 id, uint256 storeId);
  event NewTransaction(address buyer, uint256 productId);

  struct Store {
    uint256 id; // start from 1
    address storeOwner;
    bool enabled;
    string name;
    string description;
    string imageUrl;
    uint256 productCount;
  }

  struct Product {
    uint256 id; // start from 1
    uint256 storeId;
    uint256 price;
    uint256 count;
    bool enabled;
    string name;
    string description;
    string imageUrl;
  }

  struct Transaction {
    uint256 id; // start from 1
    uint256 storeId;
    uint256 productId;
    uint256 price;
    address buyer;
  }

  mapping(address => uint256) public addressToBalance;
  mapping (address => uint256) public storeOwnerToStoreId;
  mapping (uint256 => uint256[]) public storeIdToProductIds;
  Store[] public stores;
  Product[] public products;
  Transaction[] public transactions;
  uint256 public storeCount = 0;
  uint256 public productCount = 0;
  uint256 public transactionCount = 0;
  bool private isBalancesLocked;

  /** @dev Get identity of msg.sender.
    * @return isAdministrator The flag indicates if msg.sender is the administrator.
    * @return isStoreOwner The flag indicates if msg.sender is a store owner.
    */
  function getIdentity() view public returns (bool isAdministrator, bool isStoreOwner) {
    uint256 storeId = storeOwnerToStoreId[msg.sender];
    return (msg.sender == owner, storeId > 0 && storeId <= storeCount && stores[storeId.sub(1)].enabled);
  }

  /** @dev Purchase a product
    * @param _productId The id of the product.
    */
  function purchaseProduct(uint256 _productId) public payable whenNotPaused {
    require(_productId > 0 && _productId <= productCount);
    require(!isBalancesLocked);
    isBalancesLocked = true;
    Product storage product = products[_productId.sub(1)];
    require(product.enabled && msg.value >= product.price && product.count > 0);
    product.count = product.count.sub(1);
    Store storage store = stores[product.storeId.sub(1)];
    addressToBalance[store.storeOwner] = addressToBalance[store.storeOwner].add(product.price);
    uint256 transactionId = transactionCount.add(1);
    transactionCount = transactions.push(Transaction(transactionId, store.id, product.id, product.price, msg.sender));
    emit NewTransaction(msg.sender, product.id);
    // refund extra amount
    if (msg.value > product.price) {
      msg.sender.transfer(msg.value.sub(product.price));
    }
    isBalancesLocked = false;
  }

  /** @dev Withdraw the contract balance of the address
    */
  function withdrawBalance() public whenNotPaused {
    require(!isBalancesLocked);
    isBalancesLocked = true;
    uint256 amount = addressToBalance[msg.sender];
    addressToBalance[msg.sender] = 0;
    msg.sender.transfer(amount);
    isBalancesLocked = false;
  }
}