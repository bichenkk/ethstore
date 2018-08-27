pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract EthStore is Ownable {

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
  bool private lockBalances;

  /** @dev Constructor of EthStore. Will create sample stores and products.
    */
  constructor() public {
    // create and edit sample store coldWalletStore
    createStore(msg.sender);
    editStore("Cold Wallet Store", "We sell cold wallets!", "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/store-0.png");
    // add products to coldWalletStore
    addProduct(
      "Ledger Nano S",
      "Protect your crypto assets with the most popular multicurrency hardware wallet in the market. The Ledger Nano S is built around a secure chip, ensuring optimal security.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-ledger-nano.png",
      2 ether,
      100);
    addProduct(
      "Ledger Blue",
      "Ledger Blue is a premium hardware wallet with an advanced user experience thanks to a large touchscreen interface. It is built around a Secure Element and includes all the security features you’d expect from a Ledger device.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-ledger-blue.png",
      5 ether,
      0);
    addProduct(
      "Trezor One White",
      "The most trusted hardware wallet in the world. Get yours today!",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-one.jpg",
      1 ether,
      20);
    addProduct(
      "Trezor Model T",
      "The Trezor Model T is the next-generation cryptocurrency hardware wallet, designed to be your universal vault for all of your digital assets. Store and encrypt your coins, passwords and other digital keys with confidence.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-model-t.jpg",
      3 ether,
      10);
    addProduct(
      "Trezor One Black + Cryptosteel",
      "Keep your coins double protected! An ultimate bundle for crypto-beginners and hodlers alike. Get the TREZOR One in black, in a convenient package with a damage-resistant vault for your recovery seed.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-one-cryptosteel.jpg",
      10 ether,
      15);
    addProduct(
      "Trezor Model T + Cryptosteel",
      "Keep your coins double protected! An ultimate bundle for crypto-beginners and hodlers alike. Get the Trezor model T, in a convenient package with a damage-resistant vault for your recovery seed.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-t-cryptosteel.jpg",
      20 ether,
      15);
    // disable last product Trezor Model T + Cryptosteel for testing
    enableProduct(productCount, false);

    // create and edit sample store eventTicketStore
    createStore(address(0));
    Store storage eventTicketStore = stores[1];
    eventTicketStore.name = "Event Ticket Store";
    eventTicketStore.description = "We sell event tickets!";
    eventTicketStore.imageUrl = "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/store-1.jpg";
    // add products to eventTicketStore
    uint256 product1Id = productCount.add(1);
    storeIdToProductIds[eventTicketStore.id].push(product1Id);
    productCount = products.push(Product(product1Id, eventTicketStore.id, 10 ether, 0, true, "EDCON Paris 17-18 Feb", "Ethereum event", "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/event-edcon.png"));
    eventTicketStore.productCount = eventTicketStore.productCount.add(1);
    uint256 product2Id = productCount.add(1);
    storeIdToProductIds[eventTicketStore.id].push(product2Id);
    productCount = products.push(Product(product2Id, eventTicketStore.id, 5 ether, 5, true, "ETHIS Hong Kong 8 September", "Ethereum event", "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/event-ethis.png"));
    eventTicketStore.productCount = eventTicketStore.productCount.add(1);
  }

  /** @dev Check if the address has an enabled store.
    */
  modifier onlyStoreOwner() {
    uint256 storeId = storeOwnerToStoreId[msg.sender];
    require(storeId > 0 && storeId <= storeCount && stores[storeId.sub(1)].enabled);
    _;
  }

  /** @dev Get identity of msg.sender.
    * @return isAdministrator The flag indicates if msg.sender is the administrator.
    * @return isStoreOwner The flag indicates if msg.sender is a store owner.
    */
  function getIdentity() view public returns (bool isAdministrator, bool isStoreOwner) {
    uint256 storeId = storeOwnerToStoreId[msg.sender];
    return (msg.sender == owner, storeId > 0 && storeId <= storeCount && stores[storeId.sub(1)].enabled);
  }

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

  /** @dev Enable / disable a store.
    * @param _storeId The id of the store.
    * @param _enabled The flag of enabled.
    */
  function enableStore(uint256 _storeId, bool _enabled) public onlyOwner {
    require(_storeId > 0 && _storeId <= storeCount);
    Store storage store = stores[_storeId.sub(1)];
    store.enabled = _enabled;
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

  /** @dev Enable / disable a product.
    * @param _productId The id of the product.
    * @param _enabled The flag of enabled.
    */
  function enableProduct(uint256 _productId, bool _enabled) public onlyOwner {
    require(_productId > 0 && _productId <= productCount);
    Product storage product = products[_productId.sub(1)];
    product.enabled = _enabled;
  }

  /** @dev Purchase a product
    * @param _productId The id of the product.
    */
  function purchaseProduct(uint256 _productId) public payable {
    require(_productId > 0 && _productId <= productCount);
    require(!lockBalances);
    lockBalances = true;
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
    lockBalances = false;
  }

  /** @dev Withdraw the contract balance of the address
    */
  function withdrawBalance() public {
    require(!lockBalances);
    lockBalances = true;
    uint256 amount = addressToBalance[msg.sender];
    addressToBalance[msg.sender] = 0;
    msg.sender.transfer(amount);
    lockBalances = false;
  }

}