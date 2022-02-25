class Interface extends Components {
  constructor($interface) {
    super($interface.name);
    this.showStatusBar = $interface.showStatusBar;
    this.showBottomNavBar = $interface.showBottomNavBar;
    this.NodeElement.classList.add('interface');
    this.NodeElement.ref = this;
   
   super.initParams();
  }
  static create($interface) {
    var $Interface = AndroidUtils.Interface[$interface.name[0].toUpperCase() + $interface.name.slice(1)];
    if ($Interface) {
      return new $Interface($interface);
    } else {
      console.error(`Unable to create ${$interface.name} interface`);
      return null;
    }
  }

}

AndroidUtils.Interface = Interface;