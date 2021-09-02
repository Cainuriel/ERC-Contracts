import { useState } from "react";
import React  from 'react';
import { ethers } from 'ethers';
import ReceiverPays from './artifacts/contracts/ReceiverPays.sol/ReceiverPays.json';
import Swal from 'sweetalert2';

const PayCheck = () => {

    const [amount, setAmount] = useState('0.1');
    const [nonce, setNonce] = useState(0);
    const [signedHash, setSignedHash] = useState('XXXx');
    const payContract = "0x89C1F44d082172D1ff76b4EF916Da07690Dc93eF";

    async function payCheck() {

      if (typeof window.ethereum !== 'undefined') {

          const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('cuenta conectada: ', account);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          console.log('cuenta ', account);
          const contract = new ethers.Contract(payContract, ReceiverPays.abi, signer);
          let bnbAmount = ethers.utils.parseEther(amount).toString();
          console.log('transformacion en bnbs', bnbAmount );

          try {

            const tx = await contract.claimPayment(bnbAmount, nonce, signedHash, {from: account});

            if(tx) {
              Swal.fire({
              title:  `¡Ha cobrado ${amount} BNB!`,
              text: `Cheque abonado a la cuenta ${account}`,
              icon: 'success',
              confirmButtonText: 'Cerrar'
            })};

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

            //  await window.ethereum.request({method:"personal_sign", params: [account, hash]}).then((sig) => {
            //  setSignedHash(sig);
            //  var element = document.getElementById("message");
            //  element.classList.remove("d-none");
            //   });


            
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
  
              if (err.data.message === 'execution reverted: Este cheque ya se ha pagado') {
                mensajeError =  'Este cheque ya se ha pagado';
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

    

    return (
        <div className="App">       
        <div className="b-example-divider"></div>
          <div className="bg-dark container col-xl-10 col-xxl-8 px-4 py-5">
            <div className="row align-items-center g-lg-5 py-5">
              <div className="col-lg-7 text-center text-lg-start">
                <h1  className="display-4 fw-bold lh-1 mb-3 text-white">Cobro de Cheques</h1>
                <p  className="col-lg-10 fs-4 text-white">Introduzca los datos para cobrar </p>
              </div>
              <div className="col-md-10 mx-auto col-lg-5">
                <form className="p-4 p-md-5 border rounded-3 bg-light">
                  <div className="form-floating mb-3">
                    <input value={nonce} onChange={e => setNonce(e.target.value)} type="number" className="form-control" id="nonce"/>
                    <label htmlFor="amount">Serie del cheque</label>
                  </div>
                    <div className="form-floating mb-3">
                      <input value={amount} onChange={e => setAmount(e.target.value)} type="text" className="form-control" id="amount"/>
                      <label htmlFor="amount">BNBs a cobrar</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input value={signedHash} onChange={e => setSignedHash(e.target.value)} type="text" className="form-control" id="signedHash"/>
                      <label htmlFor="signedHash">Hash firmado</label>
                    </div>
                    <button id="btn-firma"  onClick={() => payCheck()} className="w-100 btn btn-lg btn-primary" type="button">Cobrar</button>
    
                        {/* <button id="btn-firma"  onClick={() => signPayment(recipient, amount, nonce, contractAddress)} className="w-100 btn btn-lg btn-primary" type="button">Firmar</button> */}
                    <hr className="my-4"/>
                    <small id="firmante" className="text-muted">...</small>
                </form>
              <div>
            </div>
          </div>
        </div>
      </div>
      {/* <div id="message" className="d-none">
                <h2 className=" text-white">Has de enviar los siguientes datos al cobrador</h2>
                <h3 className=" text-white">Serie del Cheque: {nonce}</h3>
                <h3 className=" text-white">Cantidad a cobrar en BNBs: {amount}</h3>
                <h3 className=" text-white">Hash del cheque: </h3>
                <div className=" text-white">{signedHash}</div>
                <button className="btn-warning my-5"onClick={() => {setClipboard(`Numero de serie: ${nonce} Importe: ${amount} Hash a enviar al cobrador ${signedHash}`);}}>Copiar los datos al portapapeles</button>
      </div> */}
    </div>
    )
}

export default PayCheck;