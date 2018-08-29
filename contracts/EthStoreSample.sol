pragma solidity ^0.4.23;

import "./EthStoreBase.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/** @title Create sample data for showcase */
contract EthStoreSample is EthStoreBase {

  using SafeMath for uint256;

  constructor() public {
    storeCount = stores.push(
      Store(
        storeCount.add(1),
        msg.sender,
        true,
        "Cold Wallet Store",
        "We sell cold wallets!",
        "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/store-0.png",
        0));
    storeOwnerToStoreId[msg.sender] = storeCount;

    Store storage walletStore = stores[storeCount.sub(1)];

    storeIdToProductIds[walletStore.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      walletStore.id,
      2 ether,
      100,
      true,
      "Ledger Nano S",
      "Protect your crypto assets with the most popular multicurrency hardware wallet in the market. The Ledger Nano S is built around a secure chip, ensuring optimal security.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-ledger-nano.png"
    ));
    walletStore.productCount = walletStore.productCount.add(1);

    storeIdToProductIds[walletStore.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      walletStore.id,
      5 ether,
      0,
      true,
      "Ledger Blue",
      "Ledger Blue is a premium hardware wallet with an advanced user experience thanks to a large touchscreen interface. It is built around a Secure Element and includes all the security features you’d expect from a Ledger device.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-ledger-blue.png"
    ));
    walletStore.productCount = walletStore.productCount.add(1);

    storeIdToProductIds[walletStore.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      walletStore.id,
      1 ether,
      20,
      true,
      "Trezor One White",
      "The most trusted hardware wallet in the world. Get yours today!",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-one.jpg"
    ));
    walletStore.productCount = walletStore.productCount.add(1);

    storeIdToProductIds[walletStore.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      walletStore.id,
      3 ether,
      10,
      true,
      "Trezor Model T",
      "The Trezor Model T is the next-generation cryptocurrency hardware wallet, designed to be your universal vault for all of your digital assets. Store and encrypt your coins, passwords and other digital keys with confidence.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-model-t.jpg"
    ));
    walletStore.productCount = walletStore.productCount.add(1);

    storeIdToProductIds[walletStore.id].push(productCount.add(1));
    productCount = products.push(
      Product(productCount.add(1),
      walletStore.id,
      10 ether,
      15,
      true,
      "Trezor One Black + Cryptosteel",
      "Keep your coins double protected! An ultimate bundle for crypto-beginners and hodlers alike. Get the TREZOR One in black, in a convenient package with a damage-resistant vault for your recovery seed.",
      "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/wallet-trezor-one-cryptosteel.jpg"
    ));
    walletStore.productCount = walletStore.productCount.add(1);

    storeCount = stores.push(
      Store(
        storeCount.add(1),
        address(0),
        true,
        "Event Ticket Store",
        "We sell event tickets!",
        "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/store-1.jpg",
        0));
    storeOwnerToStoreId[address(0)] = storeCount;

    Store storage ticketStore = stores[storeCount.sub(1)];

    storeIdToProductIds[ticketStore.id].push(productCount.add(1));
    productCount = products.push(
      Product(
        productCount.add(1),
        ticketStore.id,
        10 ether,
        0,
        true,
        "EDCON Paris 17-18 Feb 2017",
        "Ethereum event",
        "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/event-edcon.png"));
    ticketStore.productCount = ticketStore.productCount.add(1);

    storeIdToProductIds[ticketStore.id].push(productCount.add(1));
    productCount = products.push(
      Product(
        productCount.add(1),
        ticketStore.id,
        5 ether,
        5,
        true,
        "ETHIS Hong Kong 8 Sep 2018",
        "Ethereum event",
        "https://s3-ap-southeast-1.amazonaws.com/binatir.dev/event-ethis.png"));
    ticketStore.productCount = ticketStore.productCount.add(1);
  }

}