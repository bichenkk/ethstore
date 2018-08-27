# Design Patterns
 
## Withdrawal Pattern

When a product is purchased, the balance is not directly transferred to the store owner. Direct transfer introduces potential security risks. Instead, it is recorded in the mapping `addressToBalance`. User can call the function `withdrawBalance` to get back their own funds.

```javascript
mapping(address => uint256) public addressToBalance;

function withdrawBalance() public {
  require(!lockBalances);
  lockBalances = true;
  uint256 amount = addressToBalance[msg.sender];
  addressToBalance[msg.sender] = 0;
  msg.sender.transfer(amount);
  lockBalances = false;
}
```