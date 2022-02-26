/**
 * select an HTML element
 * @param {String} selector
 * @returns {HTMLElement}
 */
function $(selector) {
  return document.querySelector(selector);
}
/**
 * select all HTML element
 * @param {String} selector
 * @returns {NodeListOf<HTMLElement>}
 */
function $$(selector) {
  return document.querySelectorAll(selector);
}
/**
 * random Int between a and b
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
function random(a, b) {
  return Math.floor(Math.random() * b + a);
}
/**
 * simulation of writing
 * @param {HTMLElement} elt the console
 */
function writeOnTerminal(elt) {
  var textArr = elt.dataset.message.split(',');
  var pause = 10000;
  var $this = this;
  var cpt = -1;

  function typeText() {
    cpt++
    cpt = cpt == textArr.length ? 0 : cpt;
    text = textArr[cpt]
    elt.innerText = '';
    elt.classList.remove('pending');
    var letter = 0;
    var timeout = setInterval(function() {
      elt.textContent += text[letter++];
      if (letter == text.length) {
        elt.classList.add('pending');
        setTimeout(typeText, pause);
        clearInterval(timeout);
      }
    }, 130);
  }
  setTimeout(typeText, 1900);
}
/**
 * init Swipe Menu 
 */
function initSwipeMenu() {
  var menu = $('#menu[data-swipe]')
  if (menu) {
    menu.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('active');
      e.currentTarget.style.setProperty('--menu-translationX', `${10+$('#nav-menu').offsetWidth-e.currentTarget.offsetWidth*2}px`);
      e.currentTarget.style.setProperty('--menu-translationY', '0');
    })
    $('#nav-menu').classList.replace('circled', 'swipe');
  }
}
/**
 * init Circular Menu
 */
function initCircularMenu() {
  var menu = $('#menu[data-circled]');
  if (menu) {
    menu.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('active');
      e.currentTarget.style.setProperty('--menu-translationX', `50%`);
      e.currentTarget.style.setProperty('--menu-translationY', 'var(--menu-translationX)');
    })
    var items = Array.prototype.map.call($$('.nav-menu-item'), item => item);
    var nav = $('#nav-menu');
    nav.classList.add('circled');
    var angle = 360 / items.length;
    var radius = nav.offsetWidth / 2;
    var rad = x => Math.PI * x / 180;

    items.forEach((item, i) => {
      var posX = (Math.cos(rad(angle * -i)) + 1) * radius;
      var posY = (Math.sin(rad(angle * -i)) + 1) * radius;
      posX -= item.offsetWidth / 2;
      posY -= item.offsetWidth / 2;
      item.style.top = posY + 'px';
      item.style.left = posX + 'px';
    })
  }
}

function createElement(Elt, attr, data) {
  var elt = document.createElement(Elt);
  if (attr) {
    for (var prop in attr) {
      if (prop != 'text') {
        elt.setAttribute(prop, attr[prop]);
      }
    }
    if (attr.text) {
      elt.innerHTML = attr.text;
    }
  }
  if (data) {
    for (var prop in data) {
      elt[prop] = data[prop];
    }
  }
  return elt;
}

function version(href) {
  /\/(v.+)\//ig.exec(href);
  return RegExp.$1;
}

function prevImg(prefix, imgs) {
  var strImg = "";;
  imgs.forEach((img, i) => {
    strImg += `<img src="app/${prefix}/${img}" alt="${prefix}_prev_${i}"/>`
  })
  return strImg;
}

function initDownloadPage(view) {
  var DownloadPage = `<div class="downloadPage"><nav class="nav-bar"><button class="back"><span><i class="fa fa-arrow-left"></i></span></button><h2 class="title">Wilfried-Tech</h2></nav><div class="app-logo"><progress-ring class="logo" radius="55" stroke="0" shape="circle" value="50" value-color='green' linecap='round' bar-color="#e0e0e0"><img src="${view.icon.url}" /></progress-ring><div class="app-name">${view.long_name}<p class="author">Wilfried-Tech</p></div></div><div class="app-info"><table class="info"><tr><td><span><i class="fa fa-star-half-alt"></i></span>${view.rate} avis</td><td><span><i class="fa fa-download"></i></span>${view.size}</td><td><span><i class="fa fa-plus-square"></i></span>${view.min_age} ans et plus</td><td><span>plus de ${view.nb_download}</span>téléchargements</td></tr></table></div><div class="btn-group"><div class="download-btn"><a href="${view.link}">download</a></div>
    </div><div class="prev-screen">${prevImg(view.name,view.prev)}</div></div>`
  document.querySelector('.container').insertAdjacentHTML('beforeend', DownloadPage);

  var page = document.querySelector('.downloadPage');

  document.documentElement.style.setProperty('--img-count', view.prev.length);

  page.querySelector('.back').onclick = function() {
    page.remove();
  }
}
