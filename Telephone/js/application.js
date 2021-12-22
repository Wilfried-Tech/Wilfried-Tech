class Application {
  constructor(appName) {
    this.name = appName;
    this.showStatusBar = true;
    this.showBottomNavBar = true;

    var elt = document.getElementById(`${appName}-template`);

    if (!elt) {
      console.error('element with id ' + `${appName}-template` + ' not found');
      return null;
    }
    this.NodeElement = elt.cloneNode(true);
    this.NodeElement.id = elt.id.split('-')[0];
    this.NodeElement.classList.add('application');
    this.NodeElement.ref = this;
    this.activities = [];
    for (var i = 0; i < this.NodeElement.children.length; i++) {
      this.activities.push(this.NodeElement.children[i]);
      if (i) this.activities[i].style.display = 'none';
    }
    this.launchedActivity = [];
    this.launchedActivity.push(this.activities[0]);
  }
  remove() {
    this.NodeElement.remove();
  }
  startActivity(id) {
    if (this.activities.findIndex(act => act.id == id) == -1) {
      console.error('activity ' + id + ' not found in ' + this.name + ' application')
      return
    }
    this.activities.forEach(((activity) => {
      if (activity.id == id) {
        activity.style.display = 'block';
        this.launchedActivity.push(activity);
      } else {
        activity.style.display = 'none';
      }
    }).bind(this))
  }
  finish() {
    if (this.launchedActivity.length > 1) {
      var activity = this.launchedActivity.pop();
      activity.style.display = 'none';
      this.launchedActivity[this.launchedActivity.length - 1].style.display = 'block';
    } else {
      this.remove();
    }
  }
  static rename(name) {
    name = name[0].toUpperCase() + name.slice(1);
    return name.split('_').map(s => s = s[0].toUpperCase() + s.slice(1)).join('');
  }
  static create(appName) {
    var application = Application[Application.rename(appName)];
    return new Promise((resolve, reject) => {
      if (application) {
        resolve(new application(appName));
      } else {
        console.error(`Unable to create ${appName} application`);
        reject('l\'application <b style=\'text-transform: capitalize;\'>' + appName.replace(/_/g, ' ') + '</b> s\'est arrêtée');
      }
    })
  }
  select(selector, param) {
    var elt = this.NodeElement.querySelectorAll(selector);
    if (elt.length) {
      elt.forEach(el => {
        el.css = function(prop, value) {
          if (!value) return el.style.getPropertyValue(prop);

          el.style.setProperty(prop, value);

          return el;
        }
      })
      elt.css = function(prop, value) {
        if (!value) {
          var values = [];
          elt.forEach(el => values.push(el.css(prop)))
          return values;
        }
        elt.forEach(el => el.css(prop, value))
      }
    }
    return (param) ? elt : elt[0];
  }
  static getDefaults() {
    return { 'message': '' };
  }
  static launcherOf(appName) {
    const AppList = {
      "agenda": "assets/images/agenda.png",
      "android": "assets/images/android.png",
      "apple_contacts": "assets/images/apple-contacts.png",
      "camera_digital": "assets/images/camera-2.png",
      "camera": "assets/images/camera.png",
      "chrome": "assets/images/chrome.png",
      "contacts": "assets/images/contact.png",
      "discord": "assets/images/discord.png",
      "facebook": "assets/images/facebook-circled.png",
      "fichiers": "assets/images/files.png",
      "galerie": "assets/images/gallery.png",
      "jeux": "assets/images/game.png",
      "google_duo": "assets/images/google-duo.png",
      "google_map": "assets/images/google-maps.png",
      "google_photo": "assets/images/google-photos.png",
      "google_play_music": "assets/images/google-play-music.png",
      "play_store": "assets/images/google-play.png",
      "gps": "assets/images/gps-device.png",
      "horloge": "assets/images/horloge.png",
      "html": "assets/images/html-5.png",
      "imessage": "assets/images/imessage.png",
      "instagram": "assets/images/instagram.png",
      "message": "assets/images/message.png",
      "messenger": "assets/images/messenger.png",
      "mytikr": "assets/images/mytikr.png",
      "notepad": "assets/images/notepad.png",
      "telephone": "assets/images/phone-dial.png",
      "parametre": "assets/images/settings.png",
      "snapchat_1": "assets/images/snapchat-squared.png",
      "snapchat": "assets/images/snapchat.png",
      "sololearn": "assets/images/sololearn.png",
      "sublime_text": "assets/images/sublime-text.png",
      "telegram": "assets/images/telegram.png",
      "twitter": "assets/images/twitter.png",
      "uc_browser": "assets/images/uc-browser.png",
      "viber": "assets/images/viber.png",
      "whatsapp": "assets/images/whatsapp.png",
      "explorer_fichiers": "assets/images/windows-explorer.png",
      "youtube": "assets/images/youtube.png"
    }
    if (isNaN(appName)) {
      return AppList[appName];
    } else {
      var i = 0;
      for (var launcher in AppList) {
        if (i == appName) {
          return launcher;
        }
        i++;
      }
      return launcher;
    }
  }
  onBack() {}

}



AndroidUtils.Application = Application;


/*
 */