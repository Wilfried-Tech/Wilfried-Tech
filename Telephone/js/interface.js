class Interface {
  constructor($interface) {
    this.name = $interface.name;
    this.showStatusBar = $interface.showStatusBar;
    this.showBottomNavBar = $interface.showBottomNavBar;

    var elt = document.getElementById($interface.id);

    if (!elt) {
      console.error('element with id ' + $interface.id + ' not found');
      return null;
    }
    this.NodeElement = elt.cloneNode(true);
    this.NodeElement.id = elt.id.split('-')[0];
    this.NodeElement.classList.add('interface');
    this.NodeElement.ref = this;
    var oldNodeElement = $('#' + this.NodeElement.id);
    if (oldNodeElement) oldNodeElement.remove();
    this.activities = [];
    for (var i = 0; i < this.NodeElement.children.length; i++) {
      this.activities.push(this.NodeElement.children[i])
    }

  }
  static create($interface) {
    var Interface = AndroidUtils.Interface[$interface.name[0].toUpperCase() + $interface.name.slice(1)];
    if (Interface) {
      return new Interface($interface);
    } else {
      console.error(`Unable to create ${$interface.name} interface`);
      return null;
    }
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
  onBack() {}
  remove() {}
}

AndroidUtils.Interface = Interface;