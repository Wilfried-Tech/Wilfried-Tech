class Components {
  constructor(name) {
    this.name = name;
    this.showStatusBar = true
    this.showBottomNavBar = true
    this.activities = [];
    this.NodeElement = null;

    var elt = document.getElementById(`${name}-template`);

    if (!elt) {
      console.error(`NodeElement of Component ${name.toUpperCase()} not found`);
      return null;
    }
    this.NodeElement = elt.cloneNode(true);
    this.NodeElement.id = name;

    var oldNodeElement = $('#' + this.NodeElement.id);
    if (oldNodeElement) oldNodeElement.remove();

    for (var i = 0; i < this.NodeElement.children.length; i++) {
      this.activities.push(this.NodeElement.children[i])
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
  onCreate() {
    this.initParams();
  }
  onPause() {}
  onStop() {}
  onRestore() {
    this.initParams();
  }
  onDestroy() {
    this.onStop();
    this.NodeElement.remove();
    Android.unregisterComponent();
  }
  initParams() {
    phone.statusBar.style.display = this.showStatusBar ? 'block' : 'none';
    phone.bottomNavBar.style.display = this.showBottomNavBar ? 'flex' : 'none';
  }

}