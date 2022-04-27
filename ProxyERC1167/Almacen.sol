// SPDX-License-Identifier: MIT
pragma solidity ^0.5.3;


contract Almacen {

    string public mensaje;

    function setMensaje(string memory _mensaje) public {
        mensaje = _mensaje;
    }



}