# Simple Storage Demo - Truffle + Drizzle + React + Redux
 
This demo shows the integration of Truffle + Drizzle + React + Redux with the contract Simple Storage. It shows how to read and write into smart contracts from a react dapp.

## Installation

1. Install Truffle and Ganache CLI globally. Truffle is the smart contract development framework for Ethereum and Ganache is the personal blockchain running locally for development.
    ```javascript
    npm install -g truffle
    npm install -g ganache-cli
    ```

2. Run the development blockchain, we recommend passing in a blocktime. Otherwise, its difficult to track things like loading indicators because Ganache will mine instantly.
    ```javascript
    // 5 second blocktime.
    ganache-cli -b 5
    ```

3. Start truffle development console with ganache local blockchain.
    ```javascript
    truffle console --network development
    ```

4. Compile and migrate the smart contracts.
    ```javascript
    // Inside truffle development console.
    compile
    migrate --reset
    ```

5. Install MetaMask on Chrome. Choose network Localhost 8545 and import account with private key generated from ganache.

6. Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run start
    ```

7. Done! Play with this small Dapp at http://localhost:3000.

PS. Truffle can run tests written in Solidity or JavaScript.
    ```javascript
    // Inside truffle development console.
    test
    ```