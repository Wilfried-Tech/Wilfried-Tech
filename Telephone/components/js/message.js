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
    this.receiver = null;
    this.unread = {};
  }
  onBack() {
    this.finish();
    if (this.launchedActivity.length == 1) {
      this.MainActivity();
    }
  }
  async onCreate() {
    this.MainActivity();
    ripple(this.select('div.back', '*'))
    ripple(this.select('div.more', '*'))
    var onback = this.onBack.bind(this);
    this.select('.back', '*').forEach(back => {
      back.onclick = onback;
    })
  }
  sendMessage() {
    const Js = JSON.stringify,
      $this = this;

    Ajax('POST', API.Messages, AjaxData({
      action: 'POST',
      message: this.input.value.trim(),
      receiver: this.receiver.id,
      sender: User.id,
      others: `${Js({
              seen: false
            })}`
    })).then(response => {
      console.info(response);
      $this.input.value = '';
    }).catch(reason => {
      console.error(reason);
    });

  }
  setMessage(data) {
    const $this = this;
    data.forEach(row => {
      var msg = createElement('div', {
        class: 'message-item ' + ((row.sender == User.id) ? 'me' : 'him')
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
    var discussion = {},
      id = User.id,
      Jp = JSON.parse;
    const getUser = function(id) {
      return id == User.id ? User : User.Friends.getUserById(id);
    };
    this.unread = [];

    Ajax('POST', API.Messages, AjaxData({
      action: 'GET',
      sender: User.id,
      receiver: User.id
    })).catch(reason => {
      console.error(reason);
      NotificationManager.fire('Impossible de se connecter au serveur .\nVerifiez votre connexion internet et réessayer');
      $this.onBack();
    }).then(response => {
      var Messages = JSON.parse(response);
      Messages.forEach((msg, i) => {
        var name = getUser(msg.sender).name
        if (msg.receiver != id) {
          discussion[getUser(msg.receiver).name] = {
            msg: msg.message,
            id: msg.receiver,
            date: msg.date
          };
        } else {
          discussion[getUser(msg.sender).name] = {
            msg: msg.message,
            id: msg.sender,
            date: msg.date
          };
          $this.unread[name] = $this.unread[name] || { count: 0, msg: [] };

          if (!Jp(msg.others).seen) {
            $this.unread[name].count += 1
            $this.unread[name].msg.push(msg);
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
            $this.ConversationActivity(User.Friends.getUserById(discussion[name].id));
          }
        })
        this.discussion.appendChild(disc);
        if (Message.infoOnline) {
          var info = Message.infoOnline[name];
          if (info.online) {
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
      };
    })
    this.newMsg.onclick = this.ConversationPickerActivity.bind(this);
  }
  ConversationPickerActivity() {
    this.startActivity('conversationPicker');
    var $this = this;
    this.picker.innerHTML = '';
    if (User.Friends.accounts.length == 0) {
      this.picker.appendChild(createElement('h4', {
        text: 'aucun contact disponible pour l\'instant !',
        style: `width:100%;height:100%; display:flex;align-item:center;justify-content:center;`
      }))
    }
    User.Friends.accounts.forEach(user => {
      var disc = createElement('div', {
        class: 'discussion',
        text: `<div class="disc-img"><i class="fa fa-circle-user"></i></div><div class="disc-name">${user.name}</div><div class="disc-email">${user.email}</div>`
      },
      {
        onclick: function(e) {
          $this.onBack();
          $this.ConversationActivity(user);
        }
      })
      $this.picker.appendChild(disc);
    })
  }
  async ConversationActivity(receiver) {
    const $this = this;
    this.startActivity('conversation');
    this.receiverName.innerHTML = receiver.name;
    this.messages.innerHTML = '';

    this.receiver = receiver
    this.send.onclick = function(e) {
      if ($this.input.value.trim() != '') {
        $this.sendMessage().then(() => {
          $this.input.value = ''
        }).catch(err => {
          NotificationManager.fire('Impossible d\'envoyer votre msg vérifier votre connexion internet et réessayer');
        })
      }
    }
    if (Message.infoOnline) {
      var info = Message.infoOnline[receiver.name];
      if (info.online) {
        this.online.innerHTML = `<span style='color:lime;'>en ligne</span>`
      } else {
        this.online.innerHTML = `vu le ${receiver.seen.toLocaleString('fr')}`;
      }
    }
    window.addEventListener('Message', (e) => {
      if (e.detail.from.name == receiver.name || e.detail.from.name == User.name) {
        if (e.detail.object == 'new-msg') {
          $this.setMessage([e.detail.msg]);
        }
      }
      if (e.detail.from.name != receiver.name) return;

      if (e.detail.object == 'user-online') {
        $this.online.innerHTML = `<span style='color:lime;'>en ligne</span>`
      }
      if (e.detail.object == 'user-offline') {
        $this.online.innerHTML = `vu le ${e.detail.user.seen.toLocaleString('fr')}`;
      }
    })
    Ajax('POST', API.Messages, AjaxData({
      action: 'GET',
      receiver: this.receiver.id,
      sender: User.id
    })).then(response => {
      this.setMessage(JSON.parse(response));
    }).catch(reason => {
      console.log(reason);
    })

    var msg = this.unread[receiver.name].msg
    for (var i = 0, l = msg.length; i < l; i++) {
      var message = msg[i];
      await Ajax('POST', API.Messages, AjaxData({
        action: 'PUT',
        message: message.message.trim(),
        date: message.date,
        receiver: message.receiver,
        sender: message.sender,
        autres: `${JSON.stringify({seen: true})}`
      }))
      //$this.unread[receiver.name].msg.shift();
    }
  }
} //class



/*
  
  
  
  static async listenChange() {
    //console.log(User);
    Message.listenOnlineUser();
    var MsgConfig = User.config.Message || {};
    var configDiscs = MsgConfig.discussions || {};
    var discussion = {};
    var response = await (new MessageObserver(User, User)).fetch();
    var userId = User.id;
    const getUser = function(id) {
      return id == User.id ? User : User.Friends.getUserById(id);
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
    User.config.Message = MsgConfig;
    setTimeout(Message.listenChange, 1000);
  }
  static async listenOnlineUser() {
    var Users = await Ajax('POST', API.Users, AjaxData({
      action: 'GET',
      name: User.name,
      mdp: User.motPasse,
      email: User.email,
      authname: 'Wilfried-Tech',
      authpass: 'jtmlucie63'
    }))
    Users = JSON.parse(Users)
    if (Users) {
      User.Friends = new UtilisateurList(Users.accounts);
      var info = {}
      if (!Message.infoOnline) {
        Message.infoOnline = info;
      } else {
        info = Message.infoOnline;
      }
      User.Friends.accounts.forEach(user => {
        info[user.name] = info[user.name] || {};
        if (Number(user.online)) {
          if (!info[user.name].online) {
            info[user.name].online = 1;
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
          if (info[user.name].online) {
            info[user.name].online = 0;
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


*/

Application.Message = Message;