import './App.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
//import { ethers } from 'ethers'
//import { web3 } from 'web3'
//import { ABI } from 'ethereumjs-abi'
const web3 = require('web3');
const abi = require('ethereumjs-abi')

function App() {

  const [recipient, setRecipient] = useState('0x1D918aD261752d71FFD63EF9Fb217001C5875005');
  const [nonce, setNonce] = useState(Math.floor(new Date().getTime()/1000.0));
  const [amount, setAmount] = useState(100000000000000000);
  //const contractAddress = "0x1C604F706E15C796B0791Fb3B4F4f4543a4f42eD";
  const [contractAddress, setContractAddress] = useState("0x79353b87D4A0D5d5DF4B2e91A22D353415716913");
            // recipient is the address that should be paid.
            // amount, in wei, specifies how much ether should be sent.
            // nonce can be any unique number to prevent replay attacks
            // contractAddress is used to prevent cross-contract replay attacks
            function signPayment(recipient, amount, nonce, contractAddress) {
              // var hash = "0x" + abi.soliditySHA3(
              //     ["address", "uint256", "uint256", "address"],
              //     [recipient, amount, nonce, contractAddress]
              // ).toString("hex");

              console.log('recipient ', recipient);
              
              console.log('amount ', amount);
              
              console.log('nonce ', nonce);
              
              console.log('contractAddress ', contractAddress);
          
             // web3.eth.personal.sign(hash, web3.eth.defaultAccount, console.log);
              
          }

          useEffect(function () {
            init();
          },[]);

      async function init() {   

            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                let account = accounts[0];
                document.querySelector('#firmante').innerHTML = account;  
            }
      } 

    return ( 

    <div className="App">      
     
      
      <div className="b-example-divider"></div>
        <div className="bg-dark container col-xl-10 col-xxl-8 px-4 py-5">
          <div className="row align-items-center g-lg-5 py-5">
            <div className="col-lg-7 text-center text-lg-start">
              <h1  className="display-4 fw-bold lh-1 mb-3 text-white">Crear Cheque</h1>
              <p  className="col-lg-10 fs-4 text-white">Plataforma para crear cheques de BNBs </p>
            </div>
            <div className="col-md-10 mx-auto col-lg-5">
              <form className="p-4 p-md-5 border rounded-3 bg-light">
              <div className="form-floating mb-3">
                  <input value={contractAddress} onChange={e => setContractAddress(e.target.value)} type="text" className="form-control" id="contractAddress" />
                  <label htmlFor="contractAddress">Contrato de pago</label>
                </div>
                <div className="form-floating mb-3">
                  <input value={recipient} onChange={e => setRecipient(e.target.value)} type="text" className="form-control" id="recipient"/>
                  <label htmlFor="nonce">Beneficiario</label>
                </div>
                <div className="form-floating mb-3">
                  <input value={nonce} onChange={e => setNonce(e.target.value)} type="number" className="form-control" id="nonce"/>
                  <label htmlFor="amount">Serie</label>
                </div>
                <div className="form-floating mb-3">
                  <input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="form-control" id="amount"/>
                  <label htmlFor="floatingPassword">Cantidad en Weis</label>
                </div>

                <button id="btn-firma"  onClick={signPayment} className="w-100 btn btn-lg btn-primary" type="button">Firmar</button>
                <hr className="my-4"/>
                <small id="firmante" className="text-muted">...</small>
              </form>
            </div>
          </div>
        </div>
  </div>
  
  );
  
}

export default App;
