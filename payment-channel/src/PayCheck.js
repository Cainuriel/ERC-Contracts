import { useState } from 'react';
import React  from 'react';
import { ethers } from 'ethers';
import ReceiverPays from './artifacts/contracts/ReceiverPays.sol/ReceiverPays.json';
import Swal from 'sweetalert2';

const PayCheck = () => {

    const [amount, setAmount] = useState('0.1');
    const [nonce, setNonce] = useState(0);
    const [payer, setPayer] = useState('');
    const [signedHash, setSignedHash] = useState('');
    const payContract = "0x65D56f700BF136b32162Ea82dAa55516d688B1c6";

    async function payCheck() {

      if (typeof window.ethereum !== 'undefined') {

          const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(payContract, ReceiverPays.abi, signer);
          let bnbAmount = ethers.utils.parseEther(amount).toString();


          try {

            const tx = await contract.claimPayment(payer, bnbAmount, nonce, signedHash, {from: account});
            Swal.fire({
              title: 'Procesando el pago del cheque',
              text: 'Espere. No actualice la página',
              // icon: 'info',
              showConfirmButton: false,
              imageUrl: "./img/processing.gif",
              imageWidth: 100,
              imageHeight: 100,
              imageAlt: 'Procesando el ingreso',
  
            });
            const Ok = await tx.wait();
            if(tx) {
              Swal.fire({
              title:  `Se ha envíado ${amount} BNB a la cuenta ${account}`,
              html: `<a href="https://testnet.bscscan.com/tx/${tx.hash}" target="_blank" rel="noreferrer">Hash de la transacción</a>`,
              icon: 'success',
              confirmButtonText: 'Cerrar'
            })};
            console.log('transaction ', tx);
          } catch (err) {
            let mensajeError = err.message;
             
            if (err.data) {
  
              if (err.data.message === 'execution reverted: Este cheque ya se ha pagado') {
                mensajeError =  'Este cheque ya se ha pagado';
              } else if(err.data.message === 'execution reverted: El pagador no dispone del dinero suficiente para pagarle. Reclame su ingreso'){
                mensajeError =  'El pagador no dispone del dinero suficiente para pagarle. Reclame su ingreso';
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
                <h2  className="display-4 fw-bold lh-1 mb-3 text-white">Cobrar Cheque</h2>
                <p  className="col-lg-10 fs-4 text-white">Introduzca los datos requeridos para hacer efectivo su cheque. Recuerde estar usando la cuenta acreedora del cheque en su Metamask para poder cobrarlo. Cuidado al copiar con los espacios.</p>
              </div>
              <div className="col-md-10 mx-auto col-lg-5">
                <form className="p-4 p-md-5 border rounded-3 bg-light">
                  <div className="form-floating mb-3">
                    <input value={nonce} onChange={e => setNonce(e.target.value)} type="number" className="form-control" id="serie2"/>
                    <label htmlFor="serie2">Serie del cheque</label>
                  </div>
                    <div className="form-floating mb-3">
                      <input value={amount} onChange={e => setAmount(e.target.value.replace(',', '.'))} type="text" className="form-control" id="amountToPay2"/>
                      <label htmlFor="amountToPay2">BNBs a cobrar</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input value={signedHash} onChange={e => setSignedHash(e.target.value)} type="text" className="form-control" id="signedHash"/>
                      <label htmlFor="signedHash">Hash firmado</label>
                    </div>
                    <div className="form-floating mb-3 d-inline-flex">
                      <input value={payer} onChange={e => setPayer(e.target.value)} type="text" className="form-control" id="payer"/>
                      <label htmlFor="payer">Pagador</label>
                      <button type="button" className="btn btn-secondary mx-3" data-bs-toggle="modal" data-bs-target="#pagadorModal">
                  <i className="fa fa-info"></i>
                  </button>
                    </div>
                    <button id="btn-receive"  onClick={() => payCheck()} className="w-100 btn btn-lg btn-primary" type="button">Cobrar</button>

                    <hr className="my-4"/>
                </form>
              <div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de informacion */}
      <div className="modal fade" id="pagadorModal" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="pagadorModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="pagadorModalLabel">Registro del pagador</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
   Ya que ésta DAPP tiene una intención divulgativa, el contrato de pago tiene que estar disponible para diversos pagadores. Para poder realizar esa función es necesario que a la hora del cobro el acreedor determine quien es el que le debe el dinero. Éste usuario además habrá tenido que ingresar la cantidad prometida porque la seguridad del contrato <strong>rechazará todo pago de un pagador que no haya ingresado el dinero demandado</strong>. <br/><br/>
    
 Los cheques que no se hayan podido cobrar por falta de fondos <strong>no se anulan</strong>. Es decir, si el pagador ingresa el dinero posteriormente a la reclamación del acreedor se podrá ejecutar el cobro sin problemas.  <br/><br/>
 
 Para eliminar la desconfianza entre las partes, propio de la naturaleza de todo contrato inteligente, se podría añadir una claúsula más para que no pudiese realizar cheques quien no disponga del dinero ingresado en el contrato pagador de antemano. Pero he considerado que ya he complicado bastante los contratos para quien desee estudiarlos, y por tanto, he decidido no implementar ésta importante claúsula para no complicar más los contratos de la DAAP. 
    </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

      {/* fin de modal de informacion */}
    </div>
    )
}

export default PayCheck;