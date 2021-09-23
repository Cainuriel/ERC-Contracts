import './App.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import Signature from './artifacts/contracts/Signature.sol/Signature.json';
import Intro from './Intro';
import InsertMoney from './InsertMoney';
import PayCheck from './PayCheck';
import { ethers } from 'ethers';
import useClippy from 'use-clippy';

function App() {

  const [recipient, setRecipient] = useState('');
  const [nonce, setNonce] = useState(Math.floor(new Date().getTime()/1000.0));
  const [amount, setAmount] = useState('0.1');
  const [user, setUser] = useState('');// 0x48ca55D931Da2ff95ccfB78f482F4462814D2f2E
  const [contractAddress, setContractAddress] = useState("0x00e55244c13FfA6D6313718459D82536F43F6dcf"); // contrato de cobro.
  const signatureAddress = "0x854F2CBa80dAe7989Dd5729Ed2a71A1923d43243";
  const [signedHash, setSignedHash] = useState('');
  const [clipboard, setClipboard] = useClippy();
  const [condition, setCondition] = useState(true);   

            async function signPayment() {
              if (typeof window.ethereum !== 'undefined') {
                  const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  const provider = new ethers.providers.Web3Provider(window.ethereum);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(signatureAddress, Signature.abi, signer);
                  let bnbAmount = ethers.utils.parseEther(amount).toString();

                  try {
                    const hash = await contract.getMessageHash(recipient, bnbAmount, nonce, contractAddress);
                     let sig = await window.ethereum.request({method:"personal_sign", params: [account, hash]});
                      Swal.fire({
                        title: 'Copie los datos para enviar al cobrador',
                        text: `Numero de serie: ${nonce} Importe: ${amount} Pagador: ${account} Hash firmado: ${sig}`,
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: `Copiar al portapapeles`,
                        denyButtonText: `Solo quería ver como era`,
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                          setClipboard(`Numero de serie: ${nonce} Importe: ${amount} Pagador: ${account} Hash firmado: ${sig}`);
                          Swal.fire('Datos Copiados a su portapapeles', '', 'success')
                        } else if (result.isDenied) {
                          Swal.fire('El formulario conserva los datos si aún desea recuperarlos. En la consola de Javascript podrá encontrar el hash firmado.', '', 'info')
                        }
                      })
                      console.log('hash firmado: ', sig);
                      setSignedHash(sig);
                      setUser(account);

                  } catch (err) {
                    let mensajeError = err.message;
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
    <Intro/>   
      <InsertMoney/>
      <div className="bg-dark container col-xl-10 col-xxl-8 px-4 py-5">
        <div className="row justify-content-md-center">
        <h3 className="text-white text-center col-lg-4">¿Qué desea hacer?</h3>
        <button className="btn btn-lg btn-primary col-lg-4" onClick={() => setCondition(!condition)}> Crear Cheque / Cobrar Cheque </button>
        </div>
      </div>
    <div className={condition ? '' : 'd-none'}>       
      <div className="b-example-divider"></div>
        <div className="bg-dark container col-xl-10 col-xxl-8 px-4 py-5">
          <div className="row align-items-center g-lg-5 py-5">
            <div className="col-lg-7 text-center text-lg-start">
              <h2  className="display-4 fw-bold lh-1 mb-3 text-white">Crear Cheque</h2>
              <p  className="col-lg-10 fs-4 text-white">Introduzca los datos del beneficiario y cantidad a abonar para que puedan ser firmados con la cuenta que tenga conectada.</p>
              <p  className="col-lg-10 fs-4 text-white">Después de que usted firme el Hash recibirá otro con su firma incluída. Junto a el le aparecerán los datos que tendría que mandar al cobrador del mismo. Tenga a mano el bloc de notas para copiarlos.</p>
              <p  className="col-lg-10 fs-4 text-white">Añada otra cuenta de su billetera como cobrador si usted quiere realizar también el cobro del cheque.</p> 
               <p  className="col-lg-10 fs-4 text-white">El hash se puede firmar fuera de la red como verá en otros tutoriales. Sin embargo, yo utilizo otro contrato en la testnet. Si también desea verlo <a href="https://testnet.bscscan.com/address/0x854F2CBa80dAe7989Dd5729Ed2a71A1923d43243#code " target="_blank" rel="noreferrer">aquí</a> lo tiene. </p>
            </div>
            <div className="col-md-10 mx-auto col-lg-5">
              <form className="p-4 p-md-5 border rounded-3 bg-light">
                <div className="form-floating mb-3 d-inline-flex">
                  <input value={contractAddress} onChange={e => setContractAddress(e.target.value)} type="text" className="form-control" id="contractAddress" disabled/> 
                  <button type="button" className="btn btn-secondary mx-3" data-bs-toggle="modal" data-bs-target="#contratoModal">
                  <i className="fa fa-info"></i>
                  </button>
                  <label htmlFor="contractAddress">Contrato de cobro</label>   
                </div>
                <div className="form-floating mb-3">
                  <input value={recipient} onChange={e => setRecipient(e.target.value)} type="text" className="form-control" id="recipient"/>
                  <label htmlFor="recipient">Beneficiario</label>
                </div>
                <div className="form-floating mb-3 d-inline-flex">
                  <input value={nonce} onChange={e => setNonce(e.target.value)} type="number" className="form-control" id="serie"/>
                  <label htmlFor="serie">Serie del cheque</label>
                  <button type="button" className="btn btn-secondary mx-3" data-bs-toggle="modal" data-bs-target="#serieModal">
                  <i className="fa fa-info"></i>
                  </button>
                </div>
                  <div className="form-floating mb-3">
                    <input value={amount} onChange={e => setAmount(e.target.value.replace(',', '.'))} type="text" className="form-control" id="amountToPay"/>
                    <label htmlFor="amountToPay">BNBs a cobrar</label>
                  </div>
                  <button id="btn-firma"  onClick={() => signPayment()} className="w-100 btn btn-lg btn-primary" type="button">Firmar</button>
                  <hr className="my-4"/>
              </form>
            <div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className={condition ? 'd-none' : ''}>  
    <PayCheck/>
  </div>

  {/* Modals de informacion*/}

<div className="modal fade" id="contratoModal" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="contratoModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="contratoModalLabel">Contrato de pago en Hash</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      Existe un ataque que puede producirse de la forma siguiente:
      <br/><br/>
      Usted realiza algunos pagos con un contrato y luego decide destruirlo. Más tarde, implementa un nuevo contrato inteligente, con el mismo código, para realizar otros pagos. 
      Éste nuevo contrato desconoce las series de los cheques que se han pagado en la implementación anterior, por lo que el usuario puede volver a usar los mismos datos con el hash firmado para realizar un doble cobro. 
      Nos podemos proteger contra esto al incluir la dirección del contrato en el mensaje, y por tanto, solo se aceptarán los cheques firmados que correspondan con el contrato implementado para ellos.
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div className="modal fade" id="serieModal" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="serieModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="serieModalLabel">Serie de los cheques</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
    Nosotros creamos un número de serie único con un <i>stamp time</i> cuando cargamos la página. 
    Pero usted puede crear todos los cheques que desee con cualquier otra numeración. 
    Sin embargo, tenga en cuenta que si usted firma un cheque con un número de serie que ya se ha utilizado para abonar otro cheque por parte de otro usuario <strong>el suyo no podrá ser abonado</strong>.<br/><br/>
    
    Puede comprobar si un número de serie se ha utilizado desde las funciones <i>getters</i> que tenemos en el contrato. <br/><br/>
    Para saber si una serie ya se ha utilizado use la función: <i>usedNonces</i>, para saber quien lo ha cobrado con la función: <i>noncesRecipients</i>, y la cantidad que se ha abonado con la función: <i>noncesAmount</i>.
    Aquí dispone del enlace para que haga esas comprobaciones si es su deseo:<br/><br/>
    <a href="https://testnet.bscscan.com/address/0x00e55244c13FfA6D6313718459D82536F43F6dcf#readContract" target="_blank" rel="noreferrer"><i>Read Functions</i></a>
    </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

{/* Fin de los modals */}


  {/* Footer */}
  <footer className="text-center text-white my-3 container" style={{backgroundColor: "#0a4275"}}>

    <div className="p-4 pb-0">
      <section className="">
      <a className="text-decoration-none" href="https://github.com/Cainuriel/ERC-Contracts/tree/main/payment-channel" target="_blank" rel="noreferrer"> <p className="d-flex justify-content-center align-items-center">
          <span className="me-3">Código en Github </span>
          <i className="fab fa-github"></i>
        </p></a> 
      </section>
    </div>
    <div className="text-center p-3 container"  style={{backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
    2021 <a className="text-white text-decoration-none" href="https://cainuriel.github.io/"> <img src='./favicon.ico'/> 
       Developer Superloper</a>
    </div>
   
  </footer>



</div>

  );
  
}

export default App;
