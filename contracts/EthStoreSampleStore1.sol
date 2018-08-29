pragma solidity ^0.4.23;

import "./EthStore.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract EthStoreSampleStore1 is EthStore {

  using SafeMath for uint256;

  /** @dev Constructor of EthStore. Will create sample stores and products.
    */
  constructor() public {
    address storeOwner = msg.sender;
    uint256 storeId = storeCount.add(1);
    storeCount = stores.push(
      Store(
        storeId,
        storeOwner,
        true,
        "Cold Wallet Store",
        "We sell cold wallets!",
        "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/store-0.png",
        0));
    storeOwnerToStoreId[storeOwner] = storeId;

    Store storage store = stores[storeId.sub(1)];

    storeIdToProductIds[store.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      store.id,
      2 ether,
      100,
      true,
      "Ledger Nano S",
      "Protect your crypto assets with the most popular multicurrency hardware wallet in the market. The Ledger Nano S is built around a secure chip, ensuring optimal security.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-ledger-nano.png"
    ));
    store.productCount = store.productCount.add(1);

    storeIdToProductIds[store.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      store.id,
      5 ether,
      0,
      true,
      "Ledger Blue",
      "Ledger Blue is a premium hardware wallet with an advanced user experience thanks to a large touchscreen interface. It is built around a Secure Element and includes all the security features you’d expect from a Ledger device.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-ledger-blue.png"
    ));
    store.productCount = store.productCount.add(1);

    storeIdToProductIds[store.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      store.id,
      1 ether,
      20,
      true,
      "Trezor One White",
      "The most trusted hardware wallet in the world. Get yours today!",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-one.jpg"
    ));
    store.productCount = store.productCount.add(1);

    storeIdToProductIds[store.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      store.id,
      3 ether,
      10,
      true,
      "Trezor Model T",
      "The Trezor Model T is the next-generation cryptocurrency hardware wallet, designed to be your universal vault for all of your digital assets. Store and encrypt your coins, passwords and other digital keys with confidence.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-model-t.jpg"
    ));
    store.productCount = store.productCount.add(1);

    storeIdToProductIds[store.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      store.id,
      10 ether,
      15,
      true,
      "Trezor One Black + Cryptosteel",
      "Keep your coins double protected! An ultimate bundle for crypto-beginners and hodlers alike. Get the TREZOR One in black, in a convenient package with a damage-resistant vault for your recovery seed.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-one-cryptosteel.jpg"
    ));
    store.productCount = store.productCount.add(1);
  }

}