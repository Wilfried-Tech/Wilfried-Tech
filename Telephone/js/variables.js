const phone = $('#phone');
const sizeAdjust = $('#phone-scale');
const manual = $('#manual');

phone.screen = $('#screen');
phone.screen.off = $('.off-screen')


phone.volDown = $('.vol-down');
phone.volUp = $('.vol-up');
phone.power = $('.power');
registerForLongClickEvent(phone.power, 1000);

phone.bottomNavBar = $('.phone-nav-button');
phone.bottomNavBar.recent = $('.nav-button:nth-child(1)');
phone.bottomNavBar.home = $('.nav-button:nth-child(2)');
phone.bottomNavBar.back = $('.nav-button:nth-child(3)');

phone.statusBar = $('.status-bar');
registerForSwipeEvent(phone.statusBar);

phone.statusBar.time = $('.status-bar-time');
phone.statusBar.mbps = $('.status-bar-mbps');
phone.statusBar.wifi = $('.status-bar-wifi');

phone.statusBar.batteryLevel = $('.status-bar-battery-level');
phone.statusBar.batteryValue = $('.status-bar-battery-value');
phone.statusBar.chargeIndicator = $('.status-bar-battery-charge-indicator');
phone.statusBar.data = $('.status-bar-data');
phone.statusBar.dataType = $('.status-bar-4g');

phone.topBar = $('.topbar');
registerForSwipeEvent(phone.topBar.parentNode);
phone.topBar.date = $('.topbar-date');
phone.topBar.time = $('.topbar-time');
phone.topBar.settings = $('.topbar-settings');

phone.brightnessAdjust = $('#screen-brightness');

const ComponentsTemplate = $('#Components-template');

const $whatsapp = $('#gotowhatsapp');

const API = {
  get index() {
    return /^https/.test(window.location.href) ? 1 : 0;
  },
  get Users() {
    return ['php/Users/', 'https://wilfried-tech.000webhostapp.com/API/Wilfriedroid/Users/'][this.index] + 'index.php';
  },
  get Messages() {
    return ['php/Messages/', 'https://wilfried-tech.000webhostapp.com/API/Wilfriedroid/Messages/'][this.index] + 'index.php';
  }
}
var User = null;

/*
alert('Wilfriedroid V2.1')
alert(`
    maintenez le bouton allumer pour allumer le téléphone
    bouton volume non operationel !
    redimensionner le téléphone avec le bouton bleu a gauche. glisser le vers le haut pour agrandir et vers le bas pour rétrécir !
    cliquez sur le cahier a gauche pour passer en plein écran
`)

alert(`
    actuellement c'est pas tellement fun 
    mais vous pouvez voir la réaction du téléphone au éventuellement suivant
      vous charger votre téléphone
      vous activez ou désactivez la connexion 
      vous vous connectez a un wifi
`)

alert(
  `     nouveautés    
  vous pouvez désormais chatter en temps réel dans l'application message
  si vous rencontrez des problème svp contacter moi pour que je puisse le régler`
)
/*if (confirm(`
Dans quelques mois :
  mise en place du menu principal
  mise place de la barre de statut
  mise en place des applications
  .  .  .
  
  pour voir la maquette de la version future cliquez sur 'ok'
  pour le demander a Mr Wilfried sur WhatsApp !
`)) {
  
}*/