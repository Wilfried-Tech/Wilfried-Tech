"use strict"

function AndroidUtils(phone) {
  this.password = '58658243';
  this.power = 'off';
  this.volume = 100;
  this.size = Number(sizeAdjust.value);
  this.time = {
    year: 0,
    month: '',
    numDay: 0,
    day: '',
    hour: 0,
    minute: 0,
    second: 0,
    time: '',
    date: ''
  };
  this.battery = {
    level: 100,
    charging: false
  };
  this.network = {
    name: 'none',
    type: '',
    mbps: 0,
    saveData: false,
    online: false
  }
  this.width = phone.screen.clientWidth;
  this.height = phone.screen.clientHeight;
}

/*            Events             */

AndroidUtils.dispatchEvent = function(event) {
  $$('body *').forEach(elt => {
    elt.dispatchEvent(event);
  });
}

AndroidUtils.prototype.dispatchEvents = function() {
  for (var method in this) {
    if (/Event$/.test(method)) {
      this[method]();
    }
  }
}

AndroidUtils.prototype.dispatchTimeEvent = function() {
  setInterval(() => {
    var d = new Date();
    var time = this.time
    var days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    var months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

    time.hour = d.getHours();
    time.minute = d.getMinutes();
    time.second = d.getSeconds();

    time.day = days[d.getDay()];
    time.numDay = d.getDate();
    time.month = months[d.getMonth()];
    time.year = d.getFullYear();


    time.time = (time.hour > 9 ? time.hour : '0' + time.hour) + ':' + (time.minute > 9 ? time.minute : '0' + time.minute);
    time.date = `${time.day}-${time.numDay}-${time.month}-${time.year}`;

    var event = new CustomEvent('phone-timechange', {
      bubbles: true,
      cancelable: true,
      detail: {}
    });
    copyFromTo(time, event.detail, false);
    AndroidUtils.dispatchEvent(event);
  }, 1000);
}

AndroidUtils.prototype.dispatchBatteryEvent = function() {
  var _this = this;
  var event = new CustomEvent('phone-batterychange', {
    bubbles: true,
    cancelable: true,
    detail: {}
  });
  if (!('getBattery' in navigator)) {
    _this.battery.level = 100;
    _this.battery.charging = !false;
    copyFromTo(_this.battery, event.detail, false);
    AndroidUtils.dispatchEvent(event);
    return;
  }
  navigator.getBattery().then(battery => {
    _this.battery.level = Math.round(battery.level * 100);
    _this.battery.charging = battery.charging;
    battery.onlevelchange = function(e) {
      _this.battery.level = Math.floor(battery.level * 100);
      copyFromTo(_this.battery, event.detail, false);
      AndroidUtils.dispatchEvent(event);
    }
    battery.onchargingchange = function(e) {
      _this.battery.charging = battery.charging;
      copyFromTo(_this.battery, event.detail, false);
      AndroidUtils.dispatchEvent(event);
    }
    copyFromTo(_this.battery, event.detail, false);
    AndroidUtils.dispatchEvent(event);
  })
}

AndroidUtils.prototype.dispatchNetworkEvent = function() {
  var _this = this;
  var event = new CustomEvent('phone-networkchange', {
    bubbles: true,
    cancelable: true,
    detail: {}
  });

  var info = navigator.connection;
  if (!info) {
    copyFromTo(_this.network, event.detail, false);
    AndroidUtils.dispatchEvent(event);
    return;
  }

  if (info.type) {
    _this.network.name = info.type;
    _this.network.type = info.effectiveType.replace('slow-2g', '2g').toUpperCase();
    _this.network.mbps = info.downlink;
    _this.network.saveData = info.saveData;
    _this.network.online = info.type != 'none';
  }
  copyFromTo(_this.network, event.detail, false);
  AndroidUtils.dispatchEvent(event);

  navigator.connection.ontypechange = function(arg) {
    if (info.type) {
      _this.network.name = info.type;
      _this.network.type = info.effectiveType.replace('slow-2g', '2g').toUpperCase();
      _this.network.mbps = (info.type != 'none') ? info.downlink : 0;
      _this.network.saveData = info.saveData;
      _this.network.online = (info.type != 'none') ? true : false;
      copyFromTo(_this.network, event.detail, false);
      AndroidUtils.dispatchEvent(event);
    }
  }
}

AndroidUtils.prototype.sleep = function() {
  if (this.power != 'on') return;
  phone.screen.off.style.display = 'block';
  phone.screen.off.style.background = '#000';
  this.power = 'sleep';
  phone.power.style.color = 'orange';
}


AndroidUtils.prototype.boot = function() {
  if (this.power != 'off') return;
  phone.screen.off.style.display = 'block';
  phone.screen.off.style.background = `#000 url('assets/images/favicon/favicon.png') center center /contain no-repeat`;
  var _this = this;
  setTimeout(() => {
    phone.screen.off.style.background = `#000 url('assets/images/boot.gif') center center /contain no-repeat`;
    setTimeout(() => {
      Android.displayLockScreen();
      _this.power = 'on';
      phone.power.style.color = 'lime';
    }, 11900);
  }, 1500);
  this.power = 'booting';
}

AndroidUtils.prototype.displayLockScreen = async function() {
  var _this = this;
  phone.power.style.color = 'lime';

  var lockscreen = $('#lockscreen');
  if (lockscreen) lockscreen.remove();
  lockscreen = await getView('interface', '#lockscreen');
  phone.screen.appendChild(lockscreen);
  var watchDate = $('.watch-date');
  var watchTime = $('.watch-time');
  var lockscreenMain = $('.lockscreen-main');
  var lockscreenPin = $('.lockscreen-pin');

  watchTime.innerText = Android.time.time;
  watchDate.innerHTML = ''
  watchDate.innerHTML += Android.time.day.slice(0, 3) + '.  ';
  watchDate.innerHTML += Android.time.numDay + '  ';
  watchDate.innerHTML += Android.time.month.slice(0, 3) + '.  ';
  lockscreen.addEventListener('phone-timechange', (e) => {
    watchTime.innerText = e.detail.time;
    var date = e.detail;
    watchDate.innerHTML = ''
    watchDate.innerHTML += date.day.slice(0, 3) + '.  ';
    watchDate.innerHTML += date.numDay + '  ';
    watchDate.innerHTML += date.month.slice(0, 3) + '.  ';
  })
  phone.screen.off.style.display = 'none';
  phone.statusBar.style.display = 'block';
  registerForSwipeEvent(lockscreenMain);
  lockscreenMain.onswipe = function(e) {
    var detail = e.detail;
    if (detail.dir == 'up') {
      lockscreenMain.style.transform = `translateY(-${_this.height}px)`;
      lockscreenPin.style.transform = `translateY(-${_this.height}px)`;
      setTimeout(() => {
        $('.pin-message').style.display = 'none';
      }, 2000);
    }
  }
  var input = $('.pin-input input');
  input.disabled = true;
  var errorCount = 0,
    lockCount = 0;
  $$('.key').forEach(elt => {
    elt.onclick = function() {
      if (elt.classList.contains('key-del')) {
        input.value = input.value.substring(0, input.value.length - 1);
      } else if (elt.classList.contains('key-ok')) {
        if (_this.password == input.value) {
          alert('En cours de développement veillez patienter la suite arrive');
        } else {
          input.value = '';
          errorCount++;
          $('.pin-message').style.display = 'block';
          $('.pin-message-indication').style.display = 'none';
          $('.pin-message-error').classList.toggle('invalid');
          $('.pin-message-error').innerHTML = 'mot de pass incorrect !'
          if (errorCount == 5) {
            $('#keyboard').style.visibility = 'hidden';
            input.style.visibility = 'hidden';
            elt.style.visibility = 'hidden'
            errorCount = 0;
            lockCount++;
            var second = 3;
            var interval = setInterval(() => {
              $('.pin-message-error').innerHTML = 'veillez reessayer dans ' + second + ' secondes'
              second--;
              if (second == -1) {
                clearInterval(interval);
                $('#keyboard').style.visibility = 'visible';
                input.style.visibility = 'visible';
                $('.pin-message').style.display = 'none';
                $('.pin-message-error').classList.toggle('invalid');
                elt.style.visibility = 'visible'
              }
            }, 1000)
          } else {
            elt.style.visibility = 'hidden';
            setTimeout(() => {
              $('.pin-message-error').classList.toggle('invalid');
              $('.pin-message').style.display = 'none';
              elt.style.visibility = 'visible'
            }, 2000)
          }
          if (lockCount == 5) {
            lockCount = 0
            lockscreenPin.style.display = 'none';
            alert('veillez contacter Mr Wilfried pour plus d\'informations !');
          }
        }
      } else {
        input.value += elt.innerText;
      }
    }
  })
}



const Android = new AndroidUtils(phone);
//Android.displayLockScreen();