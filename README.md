<img src="https://raw.githubusercontent.com/bichenkk/ethstore/master/materials/logo.png">
 
> Final Project for 2018 Developer Program by ConsenSys Academy

This is the final project of Online Marketplace on Ethereum network by KK Chen, kk@bichenkk.com.

## What does your project do?

This is a marketplace running on Ethereum network.
Creator of this contract will become the administrator of the marketplace. He can add addresses into EthStore to allow them become store owners and create online stores with ether payment.
Store owners can list products. When there is someone purchased the product, the payment will be sent to the EthStore contract and store owner can withdraw.

Administrator can
* create store for addresses
* enable / disable store

Store owners can
* edit store information
* add products
* edit product information

Everyone can
* purchase products
* withdraw their own balances on contract
* view transactions

## How to set it up on local development server?

Make sure you have installed
* node.js v8.11.4 (The latest LTS)
* git
* yarn
* MetaMask

1. Install Truffle and Ganache CLI globally. Truffle is the smart contract development framework for Ethereum and Ganache is the personal blockchain running locally for development.
    ```javascript
    // Install Truffle globally
    npm install -g truffle
    // Install Ganache globally
    npm install -g ganache-cli
    ```

2. Run the development blockchain with 3-second blocktime.
    ```javascript
    // Run Ganache locally with 3-second blocktime on port 8545
    ganache-cli -b 3 -p 8545
    ```


3. Download and kickstart EthStore.
    ```javascript
    // Download from Github
    git clone git@github.com:bichenkk/ethstore.git
    // Kickstart EthStore
    cd ethstore
    npm run kickstart
    ```

The npm script `kickstart` will do the followings
* install npm packages
* remove truffle build files
* compile and migrate contracts on local development network (port:8545)
* start EthStore on http://localhost:3000

4. Open MetaMask on Chrome. Choose network Localhost 8545 and import account with private key generated from ganache.

5. You should be able to see the EthStore dapp. Have fun!