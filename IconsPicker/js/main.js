const result = $('.result');
const input = $('input#search');
const search = $('.search-button');

var MaterialDesignIcons = MaterialIcons = Fontawesome = [];

new File('./files/Fontawesome-v6.json').onload = function(json) {
  Fontawesome = JSON.parse(json);
  new File('./files/MaterialDesignIcons.json').onload = function(json) {
    MaterialDesignIcons = JSON.parse(json);
    new File('./files/GoogleMaterialIcons.json').onload = function(json) {
      MaterialIcons = JSON.parse(json);

      initIcons([Fontawesome, MaterialIcons, MaterialDesignIcons]);
      initSearchEngine();
    }
  }
}

function initIcons(arg) {
  var Icons = [];
  for (var i = 0; i < 100; i++) {
    var icon = arg[randInt(0, 3)];
    Icons.push(icon[randInt(0, icon.length)]);
  }
  createIcons(Icons);
}

function initSearchEngine() {

  search.onclick = function() {
    var query = input.value.trim();
    if (!/[\w]/.test(query)) {
      initIcons([Fontawesome, MaterialIcons, MaterialDesignIcons]);
      alert('ta recherche est n\'est pas correcte')
    } else {
      var regex = new RegExp(query, 'i');
      var Icons = [];
      Fontawesome.forEach((icon) => {
        if (regex.test(icon.name)) {
          Icons.push(icon);
        }
      })
      MaterialDesignIcons.forEach((icon) => {
        if (regex.test(icon.name)) {
          Icons.push(icon);
        }
      })
      MaterialIcons.forEach((icon) => {
        if (regex.test(icon.name)) {
          Icons.push(icon);
        }
      })
      Icons.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      })
      createIcons(Icons);
    }
  }
}

function createIcons(arr) {
  result.innerHTML = '';
  arr.forEach((icon, i) => {
    (function(icon, i) {
      var item = createElement('div', {
        class: 'item'
      }, {
        IconData: icon
      });
      var elt = createElement('span', {
        class: ((icon.prefix) ? icon.prefix + ' ' + icon.class : icon.class),
        text: (icon.class == 'material-icons') ? icon.name : ''
      });
      item.onclick = function() {
        createView(icon);
      };
      item.appendChild(createElement('span', null, null, [elt]));
      setTimeout(() => {
        result.appendChild(item);
      }, i * 100);
    })(icon, i);
  })
}

function createView(icon) {
  alert(JSON.stringify(icon))
}
