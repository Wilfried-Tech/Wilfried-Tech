/*
 */

class AndroidUtils {

  constructor(lastConfig) {
    this.password = '58658243';
    this._power = 'off';
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
      date: '',
      format: function(day = 10, month = 10, year = 0) {
        return `${this.day.slice(0, day)}, ${this.numDay} ${this.month.slice(0, month)}${(year) ? ' ' + this.year : ''}`
      }
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
    this.interfaces = [{
        name: 'lockscreen',
        showStatusBar: true,
        showBottomNavBar: false
    },
      {
        name: 'window',
        showStatusBar: true,
        showBottomNavBar: true
    }];
    this.openedApp = [];
    this.activeComponent = null;
    this.recentsComponent = [];
  }
  set power(v) {
    phone.power.css('color', (v == 'on' ? 'lime' : (v == 'off' ? 'red' : (v == 'sleep' ? 'orange' : ''))));
    this._power = v;
  }
  get power() {
    return this._power;
  }
  static dispatchEvent(event, target) {
    if (target) {
      target.dispatchEvent(event);
    } else {
      $$('body *').forEach(elt => {
        elt.dispatchEvent(event);
      });
    }
  }
  dispatchEvents() {
    /*for (var method in this) {
      if (/Event$/.test(method)) {
        this[method]();
      }
    }*/
    this.dispatchTimeEvent();
    this.dispatchBatteryEvent();
    this.dispatchNetworkEvent();
  }
  dispatchTimeEvent() {
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
  dispatchBatteryEvent() {
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
  dispatchNetworkEvent() {
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

    navigator.connection.onchange = function(arg) {
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
  sleep() {
    if (this.power == 'on') {
      phone.screen.off.css('display', 'block').css('background', 'var(--window-background-off)');
      this.power = 'sleep';
    }
  }
  boot() {
    if (this.power == 'off') {
      phone.screen.off.css('background', 'var(--window-boot-logo)').css('display', 'block');
      var _this = this;
      setTimeout(() => {
        phone.screen.off.css('background', 'var(--window-booting)');
        _this.displayInterface('window').then(() => {
          phone.screen.off.css('display', 'block');
        });
        setTimeout(() => {
          _this.displayInterface('lockscreen').then(() => {
            _this.power = 'on';
            Message.listenChange();
          })
        }, 11750);
      }, 1500);
      this.power = 'booting';
    }
  }
  async importAllComponents() {
    for (var i = 0, l = this.interfaces.length; i < l; i++) {
      var Interface = this.interfaces[i];
      await getView(Interface.name).then((result) => {
        Interface.id = result[2].id;
        if (/\<(\w+)\>([\w\W\s]*)\<\/\1\>/.test(result[2].response)) {
          $('#Components-template').insertAdjacentHTML('beforeend', result[2].response);
          $('#Components-template').lastElementChild.id = result[2].id;
        }
      }).catch((err) => {
        console.error(err + ' in import interfaces components ');
      });
    }
    for (var application in Application.getDefaults()) {
      await getView(application).then(result => {
        if (/\<(\w+)\>([\w\W\s]*)\<\/\1\>/.test(result[2].response)) {
          $('#Components-template').insertAdjacentHTML('beforeend', result[2].response);
          $('#Components-template').lastElementChild.id = result[2].id;
        }
      }).catch((err) => {
        console.error(err + ' in import application components ');
      });
    }
    AndroidUtils.dispatchEvent(new CustomEvent('components-imported', {
      cancelable: false,
      bubbles: false
    }), window);
  }
  displayInterface(name) {
    var i = 0,
      l = this.interfaces.length;
    while (i < l) {
      if (this.interfaces[i].name == name.toLowerCase()) {
        break;
      }
      i++;
    }
    if (i == l) {
      return Promise.reject('interface ' + name + ' doesn\'t exist');
    }

    var instance = Interface.create(this.interfaces[i]);
    if (instance != null) {
      this.activeComponent = instance;
      this.registerComponent()
      this.activeComponent.onCreate();
      phone.screen.insertAdjacentElement('beforeend', this.activeComponent.NodeElement);
      phone.screen.off.css('display', 'none');
      return Promise.resolve();
    }
    return Promise.reject('operation failed');
  }
  Fullscreen() {
    var $this = this;
    phone.screen.requestFullscreen = phone.requestFullscreen || phone.screen.webkitRequestFullscreen || phone.screen.msRequestFullscreen || phone.screen.mozRequestFullscreen;
    phone.screen.requestFullscreen();
    $this.isfullscreen = true;
    phone.screen.onfullscreenchange = phone.screen.onwebkitfullscreenchange = phone.screen.onmsfullscreenchange = phone.screen.onmozfullscreenchange = function(e) {
      phone.screen.classList.toggle('isfullscreen');
    }
  }
  launchApplication(appName) {
    Application.create(appName).then((app) => {
      if (app) {
        this.activeComponent = app;
        this.registerComponent();
        this.activeComponent.onCreate();
        phone.screen.insertAdjacentElement('beforeend', this.activeComponent.NodeElement);

        return Promise.resolve();
      }
      return Promise.reject('operation failed');
    }).catch(reason => {
      NotificationManager.fire(reason);
    });
  }
  registerComponent() {
    if (this.recentsComponent.length && this.recentsComponent[this.recentsComponent.length - 1].name == this.activeComponent.name) {
      return;
    }
    this.recentsComponent.forEach(component => {
      component.NodeElement.style.display = 'none'
    })
    this.activeComponent.NodeElement.style.display = 'block';
    this.recentsComponent.push(this.activeComponent);
    this.activeComponent.onRestore()
  }
  unregisterComponent() {
    if (this.recentsComponent.length < 2) return;
    this.recentsComponent.pop();
    this.activeComponent = this.recentsComponent.pop();
    if (this.activeComponent) this.registerComponent();
  }
  /* autoToggleNavigationBar() {
     setTimeout(() => {
       phone.bottomNavBar.css('bottom', '50px');
     }, 2000);
     phone.addEventListener('swipe',(e)=>{
       
     })
   }*/

} //class
