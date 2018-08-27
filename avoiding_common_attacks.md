# Avoiding Common Attacks
 
## Reentrancy

Inside the withdrawBalance function, the balance of address is set to zero before the transfer statement. Future invocations won't withdraw anything.

```javascript
addressToBalance[msg.sender] = 0;
msg.sender.transfer(amount);
```

## Integer Overflow and Underflow¶

Through out the EthStore contract, all math calulation are performed using SafeMath.

```javascript
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

using SafeMath for uint256;
```

## Pitfalls in Race Condition Solutions¶

For functions which involves addressToBalance, mutex is used to lock the state.

```javascript
require(!lockBalances);
lockBalances = true;
addressToBalance[msg.sender] = 0;
msg.sender.transfer(amount);
lockBalances = false;
```