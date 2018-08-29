# Avoiding Common Attacks
 
## Reentrancy

Inside the withdrawBalance function, the balance of address is set to zero before the transfer statement. Future invocations won't withdraw anything.

```javascript
addressToBalance[msg.sender] = 0;
msg.sender.transfer(amount);
```

## Integer Overflow and Underflow

Through out the EthStore contract, all math calulation are performed using SafeMath.

https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol

```javascript
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

using SafeMath for uint256;
```

## Pitfalls in Race Condition Solutions

For functions which involves addressToBalance, mutex is used to lock the state.

```javascript
require(!isBalancesLocked);
isBalancesLocked = true;
addressToBalance[msg.sender] = 0;
msg.sender.transfer(amount);
isBalancesLocked = false;
```