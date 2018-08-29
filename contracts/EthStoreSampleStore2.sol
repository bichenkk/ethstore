pragma solidity ^0.4.23;

import "./EthStore.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract EthStoreSampleStore2 is EthStore {

  using SafeMath for uint256;

  /** @dev Constructor of EthStoreSampleStores. Will create sample stores and products.
    */
  constructor() public {
    address storeOwner = address(0);
    uint256 storeId = storeCount.add(1);
    storeCount = stores.push(
      Store(
        storeId,
        storeOwner,
        true,
        "Event Ticket Store",
        "We sell event tickets!",
        "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/store-1.jpg",
        0));
    storeOwnerToStoreId[storeOwner] = storeId;

    Store storage store = stores[storeId.sub(1)];

    storeIdToProductIds[store.id].push(productCount.add(1));
    productCount = products.push(
      Product(
        productCount.add(1),
        store.id,
        10 ether,
        0,
        true,
        "EDCON Paris 17-18 Feb",
        "Ethereum event",
        "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/event-edcon.png"));
    store.productCount = store.productCount.add(1);
  }

}