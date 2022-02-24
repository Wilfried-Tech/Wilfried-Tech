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
 * @returns {HTMLElement}
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