document.documentElement.style.setProperty('--count', Data.count.page);

Data.page.forEach((view) => {
  var article = createElement('article', {
    'class': 'page',
    disabled: ((view.disabled) ? 'disabled' : '')
  })
  article.innerHTML = `${(view.type)? `<div class="type">${view.type}</div>` : ''}<img src="${view.icon.url}" alt="${view.icon.name}"><h2><a ${(view.disabled)? '':`href="${view.link}"`}">${view.name}</a></h2><div class="description"><h2>${view.description.title}</h2>${view.description.text}</div>${(view.disabled)? '<img src=\'assets/images/lock.png\'>':''}
`;
  document.querySelector('.content').appendChild(article);
});

Data.app.forEach((view) => {
  var article = createElement('article', {
    'class': 'app',
    disabled: ((view.disabled) ? 'disabled' : '')
  }, { 'view': view })
  article.innerHTML = `<div class="version" >${version(view.link)}</div><img src="${view.icon.url}" alt="${view.icon.name}"><h2><a href="#">${view.name}</a></h2><div class="description"><h2>${view.description.title}</h2>${view.description.text}</div>${(view.disabled)? '<img src=\'assets/images/lock.png\'>':''}`;
  document.querySelector('.content').appendChild(article);
});
document.querySelectorAll('.app').forEach((el) => {
  el.style.display = 'none';
});

function init() {

  document.querySelectorAll('article img').forEach((el) => {
    el.onclick = function(e) {
      var desc = el.nextElementSibling.nextElementSibling;
      desc.classList.toggle("opened");
      desc.onclick = function(e) {
        desc.classList.toggle("opened");
      }
    }
  })

  document.querySelectorAll('.opts div').forEach((el, i, p) => {
    var Class = el.classList;
    var ClassN = p[(i == 0) ? 1 : 0].classList;
    var app = document.querySelectorAll('.app'),
      page = document.querySelectorAll('.page');

    el.onclick = function() {
      if (!/open/.test(Class)) {
        Class.toggle('open');
        ClassN.toggle('open');
      }
      if (/page_tab/.test(Class)) {
        document.documentElement.style.setProperty('--count', Data.count.page);
        page.forEach((el) => {
          el.style.display = 'block';
        })
        app.forEach((el) => {
          el.style.display = 'none';
        })
      } else {
        document.documentElement.style.setProperty('--count', Data.count.app)
        page.forEach((el) => {
          el.style.display = 'none';
        })
        app.forEach((el) => {
          el.style.display = 'block';
        })
      }
    };
  });

  document.querySelectorAll('.app').forEach((el, i) => {
    var a = document.querySelectorAll('.app h2 a')[i];

    a.onclick = function(e) {
      e.preventDefault();
      if (!el.view.disabled) {
        initDownloadPage(el.view);
      }
    }

  });

  var show = false;
  document.querySelector('div.info').onclick = function(e) {
    var bioCover = document.querySelector('.bio-cover');
    var bio = bioCover.firstElementChild;
    bio.style.marginTop = (document.querySelector('html').scrollTop - bio.offsetHeight + 20) + "px";
    if (show) {
      bioCover.style.display = 'none';
      show = false;
    } else {
      bioCover.style.display = 'block';
      show = true;
    }
  }
}

init();
document.documentElement.addEventListener("resize", init, false);
window.addEventListener('resize', init, false);