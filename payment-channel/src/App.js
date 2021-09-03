import './App.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Signature from './artifacts/contracts/Signature.sol/Signature.json';
import Intro from './Intro';
import InsertMoney from './InsertMoney';
import PayCheck from './PayCheck';
import { ethers } from 'ethers';
import useClippy from 'use-clippy';

function App() {

  const [recipient, setRecipient] = useState('0x1D918aD261752d71FFD63EF9Fb217001C5875005');
  const [nonce, setNonce] = useState(Math.floor(new Date().getTime()/1000.0));
  const [amount, setAmount] = useState('0.1');
  const [user, setUser] = useState('');
  const [contractAddress, setContractAddress] = useState("0x48ca55D931Da2ff95ccfB78f482F4462814D2f2E"); // contrato de cobro.
  const signatureAddress = "0x854F2CBa80dAe7989Dd5729Ed2a71A1923d43243";
  const [signedHash, setSignedHash] = useState('XXXx');
  const [clipboard, setClipboard] = useClippy();
  const [payer, setPayer] = useState('');
     
            async function signPayment() {
              if (typeof window.ethereum !== 'undefined') {
                  const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  const provider = new ethers.providers.Web3Provider(window.ethereum);
                  const signer = provider.getSigner();
                  const contract = new ethers.Contract(signatureAddress, Signature.abi, signer);
                  let bnbAmount = ethers.utils.parseEther(amount).toString();
                  setPayer(account);
                  console.log('payerr.. ', payer);
                  try {
                    const hash = await contract.getMessageHash(recipient, bnbAmount, nonce, contractAddress);
                     await window.ethereum.request({method:"personal_sign", params: [account, hash]}).then((sig) => {
                     setSignedHash(sig);
                     var element = document.getElementById("message");
                     element.classList.remove("d-none");
                      });
          
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

          useEffect(function () {
            init();
            changeAccounts();
          },[]);

      async function init() {   

            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                let accountConnection = accounts[0];
                setUser(accountConnection);
                let subint = accountConnection.substr(0,4);
                let subfinal = accountConnection.substr(-4,4);
                document.querySelector('#firmante').innerHTML ='conectado con la cuenta: ' + subint + '...' + subfinal;
            }
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
    <h1>Ejemplo de canal de pago en red Ethereum o similares</h1>
    <Intro/>   
      <InsertMoney/>       
    <div className="b-example-divider"></div>
      <div className="bg-dark container col-xl-10 col-xxl-8 px-4 py-5">
        <div className="row align-items-center g-lg-5 py-5">
          <div className="col-lg-7 text-center text-lg-start">
            <h1  className="display-4 fw-bold lh-1 mb-3 text-white">Crear Cheque</h1>
            <p  className="col-lg-10 fs-4 text-white">El cheque generará un hash que usted tendra que firmar con una de sus cuentas. Los datos que utilizamos son: La dirección del contrato de pago, un número de serie del cheque que se genera automáticamente, la dirección del beneficiario, y su importe.   </p>
            <p  className="col-lg-10 fs-4 text-white">Después de que usted firme el Hash, le aparecerán los datos que tendría que mandar al cobrador. Pero evidentemente querrá ver como funciona. Añada otra cuenta de su billetera como cobrador. Así en el siguiente paso solo ha de pasar a ella para cobrar el cheque.</p>
            <p  className="col-lg-10 fs-4 text-white">Por último el hash que usted firmará seguidamente se puede realizar fuera de la red como verá en otros tutoriales. Sin embargo, yo utilizo otro contrato en la testnet. Si también desea verlo <a href="https://testnet.bscscan.com/address/0x854F2CBa80dAe7989Dd5729Ed2a71A1923d43243#code">aquí</a> lo tiene. </p>
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
                  <input value={amount} onChange={e => setAmount(e.target.value.replace(',', '.'))} type="text" className="form-control" id="amount"/>
                  <label htmlFor="floatingPassword">BNBs a cobrar</label>
                </div>
                <button id="btn-firma"  onClick={() => signPayment()} className="w-100 btn btn-lg btn-primary" type="button">Firmar</button>
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
            <h3 className=" text-white">Pagador: {payer} </h3>
            <button className="btn-warning my-5"onClick={() => {setClipboard(`Numero de serie: ${nonce} Importe: ${amount} Pagador: ${payer} Hash de cobro ${signedHash}`);}}>Copiar los datos al portapapeles</button>
  </div>
  <PayCheck/>
</div>

  );
  
}

export default App;
