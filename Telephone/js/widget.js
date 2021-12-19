class Widget {
  constructor(id) {
    this.id = id;
    this.Node = createElement('div', {
      class: 'widget widget-' + id
    }, {
      ref: this
    })
    this.init();
  }
  init() {
    if (this.id == 'time') {
      phone.addEventListener('phone-timechange', (e) => {
        this.Node.innerHTML = `<div class='time'>${e.detail.time}</div><div class = 'date' >${e.detail.format()}</div>`;
      })
    }
  }
}

AndroidUtils.Widget = Widget;