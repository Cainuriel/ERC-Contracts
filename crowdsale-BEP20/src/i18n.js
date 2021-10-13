import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "tops-rate": "Tops you will get per each BNB",
      "boton-compra": "Buy",
      "conectarMM": "Connect your Metamask",
      "cambia-red": "You are connected to ",
      "red": "You are not connected to BSC Network.",
      "btn-configurar-red": "Set up or change Network",
      "dispo-tops": " Available",
      "dispo-info": "Tops available for purchase",
      "no-metamask": "You do not have the metamask wallet installed",
      "no-metamask-info": "If you want to buy Tops you will have to install it",
      "install-maetamask": "Install Metamask",
      "install-processing": "Instaling Metamask Processing",
      "purchase-processing": "Processing purchase",
      "not-update": "No update the page, please",
      "congratulations": "Congratulations!",
      "are-bought": "You have bought ",
      "add-to-metamask": "Add to Metamask",
      "transaction-error": "The transaction has been rejected",
      "maximum-allowed": "You already have the maximum allowed purchase of Tops for the pre-sale",
      "no-computer": "The sale is only enabled through a larger computer or device",
      "for": "for ",
      "placeholder-amount": "Insert an amount",
      "buy-for-user": "Maximum purchase allowed per user: 3 BNBs",
      "still-has" : "You still have available to buy ",
    }
  },
  es: {
    translation: {
      "tops-rate": "Tops por cada BNB",
      "boton-compra": "Comprar",
      "conectarMM": "Conectar Metamask",
      "cambia-red": "Estás conectado a la red ",
      "red": "No estas en la red BSC.",
      "btn-configurar-red": "Configurar o cambiar Red",
      "dispo-tops": " Disponibles",
      "dispo-info": "Tops diponibles para ser comprados",
      "no-metamask": "Parece que no tienes Metamask",
      "no-metamask-info": "Para poder comprar Tops es necesario instalar Metamask",
      "install-metamask": "Instalar Metamask",
      "install-processing": "Instalando Metamask",
      "purchase-processing": "Procesando la compra",
      "not-update": "No actualice la página por favor",
      "congratulations": "¡Enhorabuena!",
      "are-bought": "Has comprado ",
      "add-to-metamask": "Añadir a Metamask",
      "transaction-error": "La transacción ha sido rechazada",
      "maximum-allowed": "Usted ya dispone del máximo permitido de compra de Tops para la preventa",
      "no-computer": "La venta solo es posible conectándose con un Ordenador o dispositivo más grande",
      "for": "por ",
      "placeholder-amount": "Introduce cantidad",
      "buy-for-user": "Máxima compra permitida por usuario: 3 BNBs",
      "still-has" : "Usted todavía puede comprar ",
    }
  }
};


i18n.use(initReactI18next)
    .init({
    resources,
    lng: 'en',
    fallbackLng: 'es'
});

export default i18n;