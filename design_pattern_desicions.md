# Design Patterns
 
## Withdrawal Pattern

When a product is purchased, the balance is not directly transferred to the store owner. Direct transfer introduces potential security risks. Instead, it is recorded in the mapping `addressToBalance`. User can call the function `withdrawBalance` to get back their own funds.

```javascript
  mapping(address => uint256) public addressToBalance;

  function withdrawBalance() public whenNotPaused {
    require(!isBalancesLocked);
    isBalancesLocked = true;
    uint256 amount = addressToBalance[msg.sender];
    addressToBalance[msg.sender] = 0;
    msg.sender.transfer(amount);
    isBalancesLocked = false;
  }
```

## Emergency Stop Pattern

The contract uses Pausable contract from OpenZeppelin to implement the Emergency Stop Pattern. The contract can be paused by the creator and functions involved ether transfer will be disabled.

https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/lifecycle/Pausable.sol

```javascript
  import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';

  contract EthStoreBase is Ownable, Pausable {
  ...

  function purchaseProduct(uint256 _productId) public payable whenNotPaused {
  ...

  function withdrawBalance() public whenNotPaused {
  ...
```