//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract EncodeDecode {

    function encode(address _account, uint _number) public pure returns (bytes memory) {
        return (abi.encode(_account, _number));
    }

function decode(bytes memory data) public pure returns (address _account, uint _number) {
        (_account, _number) = abi.decode(data, (address, uint));            
    }

    function encodeWithString(string memory _message, uint _number) public pure returns (bytes memory) {
        return (abi.encode(_message, _number));
    }

function decodeWithSring(bytes memory data) public pure returns (string memory _account, uint _number) {
        (_account, _number) = abi.decode(data, (string, uint));            
    }
}
