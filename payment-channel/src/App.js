import './App.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Signature from './artifacts/contracts/Signature.sol/Signature.json'
import PayCheck from './PayCheck';
import { ethers } from 'ethers';
import useClippy from 'use-clippy';
//import { web3 } from 'web3';
//import { ABI } from 'ethereumjs-abi'
//const web3 = require('web3');
//const abi = require('ethereumjs-abi');
//require('dotenv').config();
//const { PRIVATE_KEY } = process.env;
//console.log(web3);

function App() {

  const [recipient, setRecipient] = useState('0x1D918aD261752d71FFD63EF9Fb217001C5875005');
  const [nonce, setNonce] = useState(Math.floor(new Date().getTime()/1000.0));
  const [amount, setAmount] = useState('0.1');
 // const [account, setAccount] = useState('');
  const [contractAddress, setContractAddress] = useState("0x89C1F44d082172D1ff76b4EF916Da07690Dc93eF"); // contrato de cobro.
  const signatureAddress = "0x854F2CBa80dAe7989Dd5729Ed2a71A1923d43243";
  const [signedHash, setSignedHash] = useState('XXXx');
  const [clipboard, setClipboard] = useClippy();

            // recipient is the address that should be paid.
            // amount, in wei, specifies how much ether should be sent.
            // nonce can be any unique number to prevent replay attacks
            // contractAddress is used to prevent cross-contract replay attacks
            //function signPayment(recipient, amount, nonce, contractAddress) {
              // var hash = "0x" + abi.soliditySHA3(
              //     ["address", "uint256", "uint256", "address"],
              //     [recipient, amount, nonce, contractAddress]
              // ).toString("hex");
              // var hash = web3.utils.soliditySha3(
              //   web3.eth.abi.encodeParameters(
              //     ['address', 'uint256', 'uint256', 'address'],
              //     [recipient, amount, nonce, contractAddress]
              //   ));
               // console.log('hash ', hash);
              //web3.eth.personal.sign(hash, web3.eth.defaultAccount, callback);
           // }
     
            async function signPayment() {

              if (typeof window.ethereum !== 'undefined') {

                  const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  console.log('cuenta conectada: ', account);
                  const provider = new ethers.providers.Web3Provider(window.ethereum);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(signatureAddress, Signature.abi, signer);
                  let bnbAmount = ethers.utils.parseEther(amount).toString();
                  console.log('transformacion en bnbs', bnbAmount );
                  try {

                    const hash = await contract.getMessageHash(recipient, bnbAmount, nonce, contractAddress);
                   // let comprobacion = ethers.utils.parseEther(amount).toString()
                    //const hash = await transation.wait();
     

                      // Swal.fire({
                      //   title: "Datos hasheados antes de ser firmados",
                      //   text: `Cantidad: ${amount}, Serie del cheque: ${nonce}, Hash: ${hash}`,
                      //   icon: 'success',
                      //   confirmButtonText:  "Cerrar",
                      //   confirmButtonClass: "",
                      //   buttonsStyling: true,
                      //   showCloseButton: true,
                        // showCancelButton: true,
                        // cancelButtonClass: "btn btn-danger",
                        // denyButtonClass: "btn btn-info",
                        // showDenyButton: true,
                        // denyButtonText: `<a href="https://testnet.bscscan.com/tx/${transation.hash}">Ver en BscScan</a>`,
                      // }).then((result) => {

                      //   if (result.isConfirmed) {

                      //     console.log('hash',hash);
                      //     console.log('cantidad ',amount);
                      //     console.log('serie del cheque',nonce);
                        
                      //   } 
                      // });

                     await window.ethereum.request({method:"personal_sign", params: [account, hash]}).then((sig) => {
                     setSignedHash(sig);
                     var element = document.getElementById("message");
                     element.classList.remove("d-none");
                      });


                    
                                      // Sign the string message
                  //let flatSig = await wallet.signMessage(hash);
                  // For Solidity, we need the expanded-format of a signature
                  //let sig = ethers.utils.splitSignature(flatSig);
                 // let sig = await web3.eth.personal.sign(hash, account);
                  // if (sig) {
                  //   Swal.fire({
                  //     title: "Envie los siguientes datos",
                  //     text: `Cantidad: ${amount}, Serie del cheque: ${nonce} Cheque: ${sig}`,
                  //     icon: 'success',
                  //     confirmButtonText:  "Cerrar",
                  //     //confirmButtonClass: "",
                  //     buttonsStyling: true,
                  //     showCloseButton: true,
                  //   }).then((result) => {
                  //     if (result.isConfirmed) {
                  //       console.log('hash final', sig);
                  //       console.log('cantidad ',amount);
                  //       console.log('serie del cheque',nonce);
                  //     } 
                  //   });
                  // }
          
                  } catch (err) {
                    let mensajeError = err.message;
                     
                    if (err.data) {
          
                      if (err.data.message === '') {
                        mensajeError =  'para otra cosa';
                      } else {
                        console.log('error: ',mensajeError);
                      }
                    }
                
                    Swal.fire({
                      title: 'Ooops!',
                      text: `${mensajeError}`,
                      icon: 'error',
                      confirmButtonText: 'Cerrar'
                    })
                    console.log("Error: ", err)
                  }
              }
            }

          useEffect(function () {
            init();
          },[]);

      async function init() {   

            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                let accountConnection = accounts[0];
                let subint = accountConnection.substr(0,4);
                let subfinal = accountConnection.substr(-4,4);
                document.querySelector('#firmante').innerHTML ='conectado con la cuenta: ' + subint + '...' + subfinal;
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
                <label htmlFor="contractAddress">Contrato de cobro</label>
              </div>
              <div className="form-floating mb-3">
                <input value={recipient} onChange={e => setRecipient(e.target.value)} type="text" className="form-control" id="recipient"/>
                <label htmlFor="nonce">Beneficiario</label>
              </div>
              <div className="form-floating mb-3">
                <input value={nonce} onChange={e => setNonce(e.target.value)} type="number" className="form-control" id="nonce"/>
                <label htmlFor="amount">Serie del cheque</label>
              </div>
                <div className="form-floating mb-3">
                  <input value={amount} onChange={e => setAmount(e.target.value)} type="text" className="form-control" id="amount"/>
                  <label htmlFor="floatingPassword">BNBs a cobrar</label>
                </div>
                <button id="btn-firma"  onClick={() => signPayment()} className="w-100 btn btn-lg btn-primary" type="button">Firmar</button>

                    {/* <button id="btn-firma"  onClick={() => signPayment(recipient, amount, nonce, contractAddress)} className="w-100 btn btn-lg btn-primary" type="button">Firmar</button> */}
                <hr className="my-4"/>
                <small id="firmante" className="text-muted">...</small>
            </form>
          <div>
        </div>
      </div>
    </div>
  </div>
  <div id="message" className="d-none">
            <h2 className=" text-white">Has de enviar los siguientes datos al cobrador</h2>
            <h3 className=" text-white">Serie del Cheque: {nonce}</h3>
            <h3 className=" text-white">Cantidad a cobrar en BNBs: {amount}</h3>
            <h3 className=" text-white">Hash del cheque: </h3>
            <div className=" text-white">{signedHash}</div>
            <button className="btn-warning my-5"onClick={() => {setClipboard(`Numero de serie: ${nonce} Importe: ${amount} Hash a enviar al cobrador ${signedHash}`);}}>Copiar los datos al portapapeles</button>
  </div>
  <PayCheck/>
</div>

  );
  
}

export default App;
