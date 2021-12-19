(function() {
  const TASK = new(class Task {
    constructor() {
      this.list = [];
      this.index = -1
    }
    add(fired) {
      this.list.unshift(fired);
      if (this.index == -1) {
        this.launch();
      }
    }
    launch() {
      this.index = this.list.length - 1;
      if (this.index != -1) {
        var elt = this.list.pop();
        phone.screen.appendChild(elt);
        elt.children[0].style = 'transform: scale(0);';
        setTimeout(() => {
          elt.children[0].style = 'transform: scale(1);';
        })
      }
    }
  })();

  function mergeParam(param) {
    var d = {
      type: NotificationManager.ALERT_NOTIFICATION,
      cancelable: false,
      buttons: {
        ok: {
          cancel: true
        }
      },
      prompt: false
    }
    Object.keys(param).forEach(p => {
      d[p] = param[p];
    })
    return d
  }

  function initAlertNotification() {
    var promise = Promise.resolve(),
      buttons, alertDiv;
    this.Node = createElement('div', {
        class: 'notification-container'
      }, null,
    [alertDiv = createElement('div', {
            class: 'notification-alert',
            type: 'alert'
          }, null,
        [buttons = createElement('div', {
              class: 'notification-footer'
            })
        ])
    ]);
    var $this = this;
    for (var b in this.param.buttons) {
      var button = createElement('button', { text: b });
      if (this.param.buttons[b].cancel) {
        promise = new Promise(resolve => {
          button.onclick = function() {
            alertDiv.parentNode.remove();
            TASK.launch();
          }
        })
      } else {
        promise = new Promise(rev => {
          button.onclick = function() {
            if ($this.param.prompt) {
              rev($this.Node.querySelector('input').value)
            }
            alertDiv.parentNode.remove();
            TASK.launch();
            rev();
          }
        })
      }
      buttons.insertAdjacentElement('afterbegin', button);
    }
    alertDiv.insertAdjacentHTML('afterbegin', `<div class="notification-body"><label>${this.message}</label>${(this.param.prompt)?'<input type="text" />': ''}<div class='custom'>${(this.custom)? this.custom.outerHTML: ''}</div></div>`);

    this.Node.onclick = (this.param.cancelable) ? function(arg) {
      $this.Node.remove();
      TASK.launch();
    } : null;
    return promise;
  }

  class NotificationManager {
    constructor(msg, param, custom) {
      this.message = msg
      this.param = mergeParam(param || {});
      this.Node = null;
      this.custom = custom;
    }
    static fire(msg) {
      new NotificationManager(msg, {}, null).fire();
    }
    fire() {
      var promise;
      if (this.param.type == NotificationManager.ALERT_NOTIFICATION) {
        promise = initAlertNotification.bind(this)();
        TASK.add(this.Node);
        this.Node.ref = this;
        return promise;
      }
    }
  }

  Object.defineProperty(NotificationManager, 'PUSH_NOTIFICATION', {
    value: 0,
    writable: false
  })
  Object.defineProperty(NotificationManager, 'ALERT_NOTIFICATION', {
    value: 1,
    writable: false
  })


  window.NotificationManager = NotificationManager;
})();