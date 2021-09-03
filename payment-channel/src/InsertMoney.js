import { useEffect, useState } from 'react';
import React  from 'react';
import { ethers } from 'ethers';
import ReceiverPays from './artifacts/contracts/ReceiverPays.sol/ReceiverPays.json';
import Swal from 'sweetalert2';

const InsertMoney = () => {

    const [amount, setAmount] = useState('0.1');
    const payContract = "0x48ca55D931Da2ff95ccfB78f482F4462814D2f2E";

    async function moreMoney() {

      if (typeof window.ethereum !== 'undefined') {

          const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(payContract, ReceiverPays.abi, signer);
          let bnbAmount = ethers.utils.parseEther(amount).toString();


          try {

            const tx = await contract.moreMoney({value: bnbAmount});
            if(tx) {
              Swal.fire({
              title:  `Ingreso en proceso`,
              text: `Se enviará ${amount} BNB al contrato ${payContract}`,
              icon: 'success',
              confirmButtonText: 'Cerrar'
            })};
  
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

      useEffect(function () {
        init();
        changeAccounts();
      },[]);

      async function init() {   

                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                let accountConnection = accounts[0];
                let subint = accountConnection.substr(0,4);
                let subfinal = accountConnection.substr(-4,4);
                document.querySelector('#ingresador').innerHTML ='conectado con la cuenta: ' + subint + '...' + subfinal;
            
      } 

        // funcion que detecta los cambios de cuenta
        async function changeAccounts() {
              
          if (typeof window.ethereum !== 'undefined') {

            window.ethereum.on("accountsChanged", async function () {

              await init();
              
            });

          }
        }
    
    return (
        <div className="App">       
        <div className="b-example-divider"></div>
          <div className="bg-dark container col-xl-10 col-xxl-8 px-4 py-5">
            <div className="row align-items-center g-lg-5 py-5">
              <div className="col-lg-7 text-center text-lg-start">
                <h1  className="display-4 fw-bold lh-1 mb-3 text-white">Ingresar BNBs al contrato</h1>
                <p  className="col-lg-10 fs-4 text-white">El contrato está preparado para recibir BNBs de cualquier cuenta. Necesitamos que ingrese algo de lo capturado de la Faucet para continuar con el ejemplo. Si quiere ver ya al contrato de cobro <a href="https://testnet.bscscan.com/address/0x48ca55D931Da2ff95ccfB78f482F4462814D2f2E#code">aquí</a> lo tiene. </p>

              </div>
              <div className="col-md-10 mx-auto col-lg-5">
                <form className="p-4 p-md-5 border rounded-3 bg-light">
                    <div className="form-floating mb-3">
                      <input value={amount} onChange={e => setAmount(e.target.value.replace(',', '.'))} type="text" className="form-control" id="amount"/>
                      <label htmlFor="amount">BNBs a ingresar</label>
                    </div>
                    <button id="btn-firma"  onClick={() => moreMoney()} className="w-100 btn btn-lg btn-primary" type="button">Ingresar</button>
    
                        {/* <button id="btn-firma"  onClick={() => signPayment(recipient, amount, nonce, contractAddress)} className="w-100 btn btn-lg btn-primary" type="button">Firmar</button> */}
                    <hr className="my-4"/>
                    <small id="ingresador" className="text-muted">...</small>
                </form>
              <div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default InsertMoney;