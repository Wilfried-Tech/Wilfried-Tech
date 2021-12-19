class Message extends Application {
  constructor(name) {
    super(name);
    this.send = this.select('#message-send')
    this.input = this.select('#message-input')
    this.messages = this.select('#messages');
    this.newMsg = this.select('div.new-msg');
    this.discussion = this.select('.message-list');
    this.receiverName = this.select('.receiver');
    this.online = this.select('.receiver-online');
    this.picker = this.select('.message-picker-list');

    this.Observer = null;
    this.receiver = null;
    this.unread = {};
  }
  onBack() {
    this.finish();
    if (this.launchedActivity.length == 1) {
      this.MainActivity();
    }
  }
  sendMessage() {
    const Js = JSON.stringify,
      $this = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://wilfried-tech.000webhostapp.com/API/Wilfriedroid/Messages/', true);
    xhr.send(AjaxData({
      action: 'POST',
      authname: 'Wilfried-Tech',
      authpass: 'jtmlucie63',
      message: this.input.value.trim(),
      destinataire: this.receiver.id,
      expediteur: Android.User.id,
      autres: `${Js({
            seen: false
          })}`
    }));
    return new Promise((resolve, reject) => {
      xhr.onerror = function(e) {
        reject(xhr.statusText)
      }
      xhr.onload = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          }
          if (xhr.status >= 400 && xhr.status < 500) {
            reject(xhr.responseText);
          }
          if (xhr.status >= 500) {
            reject(xhr.responseText);
          }
        }
      }
    })
  }
  setMessage(data) {
    const $this = this;
    data.forEach(row => {
      var msg = createElement('div', {
        class: 'message-item ' + ((row.expediteur == Android.User.id) ? 'me' : 'him')
      }, null, [createElement('div', {
        class: 'message-content',
        text: row.message
      })]);
      $this.messages.insertAdjacentElement('afterbegin', msg);
    })
    this.messages.parentNode.scrollTo({
      top: this.messages.parentNode.scrollHeight
    })
  }
  async MainActivity() {
    var $this = this;
    this.unread = [];
    var messages = await (new MessageObserver(Android.User, Android.User)).fetch();
    if (!messages) {
      NotificationManager.fire('la connexion au serveur est impossible');
      this.onBack();
    }
    var discussion = {},
      id = Android.User.id,
      Jp = JSON.parse;
    const getUser = function(id) {
      return id == Android.User.id ? Android.User : Android.UserList.getUserById(id);
    };

    messages.forEach((msg, i) => {
      var nom = getUser(msg.expediteur).nom
      if (msg.destinataire != id) {
        discussion[getUser(msg.destinataire).nom] = {
          msg: msg.message,
          id: msg.destinataire,
          date: msg.date
        };
      } else {
        discussion[getUser(msg.expediteur).nom] = {
          msg: msg.message,
          id: msg.expediteur,
          date: msg.date
        };
        $this.unread[nom] = $this.unread[nom] || { count: 0, msg: [] };

        if (!Jp(msg.autres).seen) {
          $this.unread[nom].count += 1
          $this.unread[nom].msg.push(msg);
        }
      }
    })

    this.discussion.innerHTML = '';

    for (var name in discussion) {
      /(\d+):(\d+):\d+/.test(discussion[name].date)
      var { $1, $2 } = RegExp;
      var disc = createElement('div', {
        class: 'discussion',
        text: `<div class="disc-img"><i class="fa fa-circle-user"></i></div><div class="disc-name" data-date="${$1}:${$2}">${name}</div><div class="disc-last-msg">${discussion[name].msg}</div>${(this.unread[name].count)?`<div class='disc-unread'>${this.unread[name].count}</div>`:''}`
      },
      {
        onclick: function(e) {
          $this.ConversationActivity(Android.UserList.getUserById(discussion[name].id));
        }
      })
      this.discussion.appendChild(disc);
      if (Message.infoOnline) {
        var info = Message.infoOnline[name];
        if (info.enligne) {
          disc.style.setProperty('--online', 'lime')
        }
      }
      window.addEventListener('Message', (e) => {
        if (e.detail.object == 'new-msg') {
          $this.MainActivity();
        } else {
          disc.style.setProperty('--online', (e.detail.object == 'user-online' ? 'lime' : '#fff0'))
        }
      })
    }
    this.newMsg.onclick = this.ConversationPickerActivity.bind(this);
  }
  async ConversationActivity(receiver) {
    const $this = this;
    this.startActivity('conversation');
    this.receiverName.innerHTML = receiver.nom;
    this.messages.innerHTML = '';
    this.Observer = new MessageObserver(Android.User, receiver)
    this.receiver = receiver
    this.send.onclick = function(e) {
      if ($this.input.value.trim() != '') {
        $this.sendMessage().then(() => {
          $this.input.value = ''
        }).catch(err => {
          NotificationManager.fire('la connexion au serveur est impossible');
        })
      }
    }
    if (Message.infoOnline) {
      var info = Message.infoOnline[receiver.nom];
      if (info.enligne) {
        this.online.innerHTML = `<span style='color:lime;'>enligne</span>`
      } else {
        this.online.innerHTML = `vu le ${receiver.vu.toLocaleString('fr')}`;
      }
    }
    window.addEventListener('Message', (e) => {
      if (e.detail.from.nom == receiver.nom || e.detail.from.nom == Android.User.nom) {
        if (e.detail.object == 'new-msg') {
          $this.setMessage([e.detail.msg]);
        }
      }
      if (e.detail.from.nom != receiver.nom) return;

      if (e.detail.object == 'user-online') {
        $this.online.innerHTML = `<span style='color:lime;'>enligne</span>`
      }
      if (e.detail.object == 'user-offline') {
        $this.online.innerHTML = `vu le ${e.detail.user.vu.toLocaleString('fr')}`;
      }
    })
    var Messages = await this.Observer.fetch();
    this.setMessage(Messages);
    var msg = this.unread[receiver.nom].msg
    for (var i = 0; i < msg.length; i++) {
      var message = msg[i];
      await Ajax('POST', 'https://wilfried-tech.000webhostapp.com/API/Wilfriedroid/Messages/', AjaxData({
        action: 'PUT',
        authname: 'Wilfried-Tech',
        authpass: 'jtmlucie63',
        message: message.message.trim(),
        date: message.date,
        destinataire: message.destinataire,
        expediteur: message.expediteur,
        autres: `${JSON.stringify({
                    seen: true
                  })}`
      }))
      //$this.unread[receiver.nom].msg.shift();
    }
  }
  async start() {
    this.MainActivity();
    ripple(this.select('div.back', '*'))
    ripple(this.select('div.more', '*'))
    var onback = this.onBack.bind(this);
    this.select('.back', '*').forEach(back => {
      back.onclick = onback;
    })
  }
  ConversationPickerActivity() {
    this.startActivity('conversationPicker');
    var $this = this;
    this.picker.innerHTML = '';
    Android.UserList.accounts.forEach(user => {
      var disc = createElement('div', {
        class: 'discussion',
        text: `<div class="disc-img"><i class="fa fa-circle-user"></i></div><div class="disc-name">${user.nom}</div><div class="disc-email">${user.email}</div>`
      },
      {
        onclick: function(e) {
          $this.onBack();
          $this.ConversationActivity
          $this.ConversationActivity(user);
        }
      })
      $this.picker.appendChild(disc);
    })

  }
  static async listenChange() {
    Message.listenOnlineUser();

    var MsgConfig = Android.User.config.Message || {};
    var configDiscs = MsgConfig.discussions || {};
    var discussion = {};
    var response = await (new MessageObserver(Android.User, Android.User)).fetch();
    var userId = Android.User.id;
    const getUser = function(id) {
      return id == Android.User.id ? Android.User : Android.UserList.getUserById(id);
    };
    response.forEach((msg, i) => {
      const { message, expediteur, destinataire } = msg;
      if (expediteur != userId) {
        discussion[expediteur] = discussion[expediteur] || [];
        discussion[expediteur].push({
          id: expediteur,
          msg: message,
          info: msg
        })
      } else {
        discussion[destinataire] = discussion[destinataire] || [];
        discussion[destinataire].push({
          id: expediteur,
          msg: message,
          info: msg
        })
      }
    })
    for (var $id in discussion) {
      var last = discussion[$id][discussion[$id].length - 1];
      if (!configDiscs[$id]) {
        configDiscs[$id] = {
          info: last.info,
          id: last.id,
          lastMsg: last.msg
        };
      }
    }

    for (var $id in discussion) {
      var last = discussion[$id][discussion[$id].length - 1]
      if (last.msg != configDiscs[$id].lastMsg) {
        AndroidUtils.dispatchEvent(new CustomEvent('Message', {
          bubbles: true,
          cancelable: false,
          detail: {
            object: 'new-msg',
            from: getUser(last.id),
            msg: last.info
          }
        }), window);
        configDiscs[$id].lastMsg = last.msg;
      }
    }
    MsgConfig.discussions = configDiscs;
    Android.User.config.Message = MsgConfig;
    setTimeout(Message.listenChange, 1000);
  }
  static async listenOnlineUser() {
    var Users = await Ajax('POST', 'https://wilfried-tech.000webhostapp.com/API/Wilfriedroid/Messages/index.phpindex.php', AjaxData({
      action: 'GET',
      nom: Android.User.nom,
      mdp: Android.User.motPasse,
      email: Android.User.email,
      authname: 'Wilfried-Tech',
      authpass: 'jtmlucie63'
    }))
    Users = JSON.parse(Users)
    if (Users) {
      Android.UserList = new UtilisateurList(Users.accounts);
      var info = {}
      if (!Message.infoOnline) {
        Message.infoOnline = info;
      } else {
        info = Message.infoOnline;
      }
      Android.UserList.accounts.forEach(user => {
        info[user.nom] = info[user.nom] || {};
        if (Number(user.enligne)) {
          if (!info[user.nom].enligne) {
            info[user.nom].enligne = 1;
            AndroidUtils.dispatchEvent(new CustomEvent('Message', {
              bubbles: true,
              cancelable: false,
              detail: {
                object: 'user-online',
                user: user
              }
            }), window)
          }
        } else {
          if (info[user.nom].enligne) {
            info[user.nom].enligne = 0;
            AndroidUtils.dispatchEvent(new CustomEvent('Message', {
              bubbles: false,
              cancelable: false,
              detail: {
                object: 'user-offline',
                user: user
              }
            }))
          }
        }
      })
      Message.infoOnline = info;
    }
  }

} //class


class MessageObserver {
  constructor(sender, receiver) {
    this.sender = sender;
    this.receiver = receiver;
    this.xhr = new XMLHttpRequest();
  }
  fetch() {
    const $this = this;
    this.xhr.open('POST', 'https://wilfried-tech.000webhostapp.com/API/Wilfriedroid/Messages/');
    this.xhr.send(AjaxData({
      action: 'GET',
      authname: 'Wilfried-Tech',
      authpass: 'jtmlucie63',
      expediteur: this.sender.id,
      destinataire: this.receiver.id
    }));
    return new Promise((resolve, reject) => {
      $this.xhr.onerror = function(e) {
        NotificationManager.fire('la connexion au serveur est impossible');
        reject($this.xhr.statusText)
      }
      $this.xhr.onload = function(e) {
        if ($this.xhr.readyState == XMLHttpRequest.DONE) {
          if ($this.xhr.status >= 200 && $this.xhr.status < 300) {
            resolve(JSON.parse($this.xhr.response))
          }
          if ($this.xhr.status >= 400 && $this.xhr.status < 500) {
            NotificationManager.fire('la connexion au serveur est impossible');
            reject($this.xhr.responseText);
          }
          if ($this.xhr.status >= 500) {
            NotificationManager.fire('la connexion au serveur est impossible');
            reject($this.xhr.responseText);
          }
        }
      }
    })
  }
}


Application.Message = Message;