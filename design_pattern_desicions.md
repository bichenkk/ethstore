# Design Patterns
 
## Withdrawal Pattern

When a product is purchased, the balance is not directly transferred to the store owner. Direct transfer introduces potential security risks. Instead, it is recorded in the mapping `addressToBalance`. User can call the function `withdrawBalance` to get back their own funds.

```javascript
mapping(address => uint256) public addressToBalance;

function withdrawBalance() public {
  require(!isBalancesLocked);
  isBalancesLocked = true;
  uint256 amount = addressToBalance[msg.sender];
  addressToBalance[msg.sender] = 0;
  msg.sender.transfer(amount);
  isBalancesLocked = false;
}
```

## Emergency Stop Pattern

The contract can be emergency stopped and the purchase and withdrawal functions which involved in ether will be restricted. Only administrator can control the emergency stop.

```javascript
bool public isEmergencyStopped;

modifier stoppedInEmergency() {
  require(!isEmergencyStopped);
  _;
}

  function stopContract() public onlyOwner {
      isEmergencyStopped = true;
  }

  function resumeContract() public onlyOwner {
      isEmergencyStopped = false;
  }

  function purchaseProduct(uint256 _productId) public payable stoppedInEmergency {
  ...

  function withdrawBalance() public stoppedInEmergency {
  ...
```