/* GET USER AND CONFIGURATION */

initLogin();

/* IMPORT COMPONENTS */

const Android = new AndroidUtils(phone, {});

window.addEventListener('Logged', (e) => {
  Android.importAllComponents().then(() => {
    Android.displayInterface('window').then(() => { phone.screen.off.css('display', 'none') })
    Android.launchApplication('message');
      Message.listenChange();

    /*
    var m = new NotificationManager('some thing to notify', {
      type: NotificationManager.ALERT_NOTIFICATION,
      prompt:true
    },createElement('img',{
      src:'assets/images/android-boot.gif'
    }));
    m.fire();*/
  });
  Android.dispatchEvents();
})

/* RIPPLE ANIMATIONS */

ripple($$('.topbar .options li '));
ripple($$('.phone-nav-button .nav-button'));

/* SOME OTHER CODE */


sizeAdjust.oninput = function(e) {
  phone.css('transform', `translate(-50%,-50%) scale(${e.target.value})`);
}

phone.brightnessAdjust.oninput = function(e) {
  phone.screen.css('opacity', e.target.value);
}

phone.topBar.addEventListener('phone-timechange', (e) => {
  phone.topBar.time.innerText = e.detail.time;
  phone.topBar.date.innerHTML = e.detail.format(3, 3) + '.';
})

phone.statusBar.time.addEventListener('phone-timechange', (e) => {
  e.target.innerText = e.detail.time;
}, false);

phone.statusBar.batteryLevel.addEventListener('phone-batterychange', (e) => {
  e.target.innerText = e.detail.level + '%';
  phone.statusBar.batteryValue.css('width', e.detail.level + '%');
  phone.statusBar.batteryValue.css('background-color', (e.detail.level <= 15) ? 'red' : 'white');

  phone.statusBar.batteryValue.css('background-color', (e.detail.charging) ? 'lime' : phone.statusBar.batteryValue.css('background-color'));
  phone.statusBar.chargeIndicator.css('display', (e.detail.charging) ? 'block' : 'none');
})

phone.addEventListener('phone-networkchange', (e) => {
  var info = e.detail;
  phone.statusBar.dataType.innerText = (info.online) ? info.type : 'H';
  phone.statusBar.data.css('display', (info.name == 'cellular') ? 'initial' : 'none');
  phone.statusBar.wifi.css('display', (info.name == 'wifi') ? 'initial' : 'none');
  phone.statusBar.mbps.innerText = (info.online) ? info.mbps + ' Mb/s' : '';
})

window.addEventListener('components-imported', function(e) {
  phone.power.addEventListener('longclick', function(e) {
    if (Android.power == 'off') {
      Android.boot();
      Message.listenChange();
    } else {
      //Android.shutDown();
    }
  })

  phone.power.addEventListener('click', function() {
    if (Android.power == 'on') {
      Android.sleep();
    } else if (Android.power == 'sleep') {
      Android.power = 'on';
      Android.displayInterface('lockscreen');
    }
  })
});

phone.statusBar.addEventListener('swipe', (e) => {
  if (e.detail.direction == 'down') {
    phone.topBar.parentNode.classList.add('topbar-open');
  }
})

phone.topBar.parentNode.addEventListener('swipe', function(e) {
  if (e.detail.direction == 'up' && e.detail.distance >= 50) {
    phone.topBar.parentNode.classList.remove('topbar-open');
  }
})

manual.onclick = function() {
  Android.Fullscreen();
}

window.onblur = window.onunload = function() {
  User.online = 0
  User.exportData();
}

phone.bottomNavBar.back.addEventListener('click', (e) => {
  Android.activeComponent.onBack();
})
phone.bottomNavBar.home.addEventListener('click', (e) => {
  if (Android.activeComponent instanceof Application) {
    Android.activeComponent.remove();
    Android.displayInterface('Window');
  } else {
    Android.activeComponent.onBack();
  }
})


/**/