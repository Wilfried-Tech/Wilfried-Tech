function $(elt = '') {
  return document.querySelector(elt);
}

function $$(elt = '') {
  return document.querySelectorAll(elt);
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

async function getView(file, id) {
  var iframe = createElement('iframe', {
    src: 'templates/' + file + '.html',
    width: 0,
    height: 0,
    hidden: ''
  });
  document.body.appendChild(iframe);
  return new Promise((revolve, reject) => {
    iframe.onload = function() {
      revolve(iframe.contentDocument.querySelector(id).cloneNode(true));
      iframe.remove();
    }
  })
}