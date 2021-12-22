function $(elt = '') {
  elt = document.querySelector(elt);
  if (elt) {
    elt.css = function(prop, value) {
      if (!value) return elt.style.getPropertyValue(prop);
      elt.style.setProperty(prop, value);
      return elt;
    }
  }
  return elt;
}

function $$(elt = '') {
  elt = document.querySelectorAll(elt);
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
  return elt;
}

function copyFromTo(a = {}, b = {}, writable = true) {
  Object.keys(a).forEach(key => {
    Object.defineProperty(b, key, {
      writable: writable,
      enumerable: true,
      configurable: true,
      value: a[key],
    })
  })
}

function ripple(elts) {
  elts.forEach((elt) => {
    elt.setAttribute('ripple', '');
    var id = undefined;
    elt.addEventListener('click', (e) => {
      var rect = elt.getBoundingClientRect();
      var x = e.pageX - rect.left - (elt.offsetWidth / 2)
      var y = e.pageY - rect.top - (elt.offsetHeight / 2)
      elt.style.setProperty('--ripple-position-top', y + 'px');
      elt.style.setProperty('--ripple-position-left', x + 'px');

      if (elt.classList.contains('ripple-active')) {
        elt.classList.remove('ripple-active');
        clearTimeout(id);
      }
      id = setTimeout(() => {
        elt.classList.add('ripple-active')
      }, 50);
    })
  })
}

async function getView(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'components/' + name + '.html');
  xhr.send(null);
  var script, link;
  document.body.appendChild(script = createElement('script', {
    src: `components/js/${name}.js`,
    type: 'text/javascript'
  }));
  document.head.appendChild(link = createElement('link', {
    rel: 'stylesheet',
    href: `components/css/${name}.css`,
    type: 'text/css'
  }));

  return Promise.all([new Promise((revolve, reject) => {
    link.onload = revolve;
    link.onerror = reject;
  }), new Promise((revolve, reject) => {
    script.onload = revolve;
    script.onerror = reject;
  }), new Promise((revolve, reject) => {
    xhr.onload = function() {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        revolve({
          response: xhr.responseText,
          id: name + '-template'
        });
      } else {
        reject(xhr.statusText + ' from getView ' + name);
      }
    }
  })])
}

async function Ajax(method, url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true, 'Wilfried-Tech', 'jtmlucie63');
  xhr.send(data);
  return new Promise((revolve, reject) => {
    xhr.onload = function(e) {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status >= 200 && xhr.status < 300) {
        revolve(xhr.responseText);
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(xhr.responseText);
      }
    }
    xhr.onerror = function(e) {
      reject(xhr.statusText + ' (error code: ' + xhr.status + ' )');
    }
  })
}

function AjaxData(obj) {
  var data = new FormData();
  for (var p in obj) {
    data.append(p, obj[p]);
  }
  return data
}

function $click(url) {
  var a;
  $('.off-screen').appendChild(a = createElement('a', {
    href: url,
    onclick: 'setTimeout(this.remove.bind(this),1000);'
  }));
  a.click();
}

function rand(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}