// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.6.99 <0.8.0;

contract ReceiverPays {
    
    address payable public owner = msg.sender;

    mapping(uint256 => bool) public usedNonces;
    mapping(uint256 => address) public noncesRecipients;
    mapping(uint256 => uint256) public noncesAmount;
    mapping(address => uint256) moneyPayers;

    constructor() payable {}
    
    function moreMoney() public payable {

        moneyPayers[msg.sender] = moneyPayers[msg.sender] + msg.value;
 
    }
    
    function balanceOf() public view returns(uint256) {

       return address(this).balance;
    }
    
      function recipientBalance(address recipient) public view returns(uint256) {

      return moneyPayers[recipient];
    }

    function claimPayment(address payer, uint256 amount, uint256 nonce, bytes memory signature) public {
        require(!usedNonces[nonce], 'Este cheque ya se ha pagado');

        // this recreates the message that was signed on the client
        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, amount, nonce, this)));

        require(recoverSigner(message, signature) == payer);
        // the payer account cannot pay more money than he have entered
        require(moneyPayers[payer] >= amount, 'El pagador no dispone del dinero suficiente para pagarle. Reclame su ingreso');
        usedNonces[nonce] = true;
        moneyPayers[payer] = moneyPayers[payer] - amount;
        msg.sender.transfer(amount);
        noncesRecipients[nonce] = msg.sender;
        noncesAmount[nonce] = amount;
        
    }

    /// empty the money contract
    function shutdown() public {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
        
    }

    /// signature methods.
    function splitSignature(bytes memory sig)
        internal
        pure
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        require(sig.length == 65);

        assembly {
            // first 32 bytes, after the length prefix.
            r := mload(add(sig, 32))
            // second 32 bytes.
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes).
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        internal
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    /// builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}