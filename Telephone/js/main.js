sizeAdjust.onchange = function(e) {
  phone.style = `transform:  translate(-50%,-50%) scale(${e.target.value});`;
}

phone.statusBar.time.addEventListener('phone-timechange', (e) => {
  e.detail.time = '0000'
  e.target.innerText = e.detail.time;
}, false);

phone.statusBar.batteryLevel.addEventListener('phone-batterychange', (e) => {
  e.target.innerText = e.detail.level + '%';
  phone.statusBar.batteryValue.style.width = e.detail.level + '%';
  phone.statusBar.batteryValue.style.backgroundColor = (e.detail.level <= 15) ? 'red' : 'white';
  phone.statusBar.batteryValue.style.backgroundColor = (e.detail.charging) ? 'lime' : phone.statusBar.batteryValue.style.backgroundColor;
  phone.statusBar.chargeIndicator.style.display = (e.detail.charging) ? 'block' : 'none';
})

phone.addEventListener('phone-networkchange', (e) => {
  var info = e.detail;
  phone.statusBar.dataType.innerText = (info.online) ? info.type : 'H';
  phone.statusBar.data.style.display = (info.name == 'cellular') ? 'initial' : 'none';
  phone.statusBar.wifi.style.display = (info.name == 'wifi') ? 'initial' : 'none';
  phone.statusBar.mbps.innerText = (info.online) ? info.mbps + ' Mb/s' : '';
})

window.onload = function(e) {
  phone.power.onlongclick = function(e) {
    Android.boot();
  }
  phone.power.onclick = function() {
    if (Android.power == 'on') {
      Android.sleep();
    } else if (Android.power == 'sleep') {
      Android.power = 'on'
      Android.displayLockScreen();
    }
  }
}


Android.dispatchEvents();

/**/