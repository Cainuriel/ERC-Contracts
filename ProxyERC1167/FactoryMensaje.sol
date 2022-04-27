// SPDX-License-Identifier: MIT
pragma solidity ^0.5.3;

import "https://github.com/OpenZeppelin/openzeppelin-sdk/blob/master/packages/lib/contracts/upgradeability/ProxyFactory.sol";


contract FactoryMensajes is ProxyFactory {

    address public contractStore;

    constructor(address _contract) public {
        contractStore = _contract;
    }

    function clonar() public {
        deployMinimal(contractStore, "");

    }
}