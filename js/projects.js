document.documentElement.style.setProperty('--count', Data.count.page)

var projects = $(".projects")

Data.page.forEach((view) => {
  var article = createElement('article', {
    'class': 'page',
    disabled: ((view.disabled) ? 'disabled' : '')
  })
  article.innerHTML = `${(view.type) ? `<div class="type">${view.type}</div>` : ''}<img src="${view.icon.url}" alt="${view.icon.name}"><h2><a ${(view.disabled) ? '' : `href="${view.link}"`}">${view.name}</a></h2><div class="description"><h2>${view.description.title}</h2>${view.description.text}</div>${(view.disabled) ? '<img class=\'locked\' src=\'assets/images/lock.png\'>' : ''}
`
  projects.appendChild(article)
})

Data.app.forEach((view) => {
  var article = createElement('article', {
    'class': 'app',
    disabled: ((view.disabled) ? 'disabled' : '')
  }, { 'view': view })
  article.innerHTML = `<div class="version" >${version(view.link)}</div><img src="${view.icon.url}" alt="${view.icon.name}"><h2><a href="#">${view.name}</a></h2><div class="description"><h2>${view.description.title}</h2>${view.description.text}</div>${(view.disabled) ? '<img class=\'locked\' src=\'assets/images/lock.png\'>' : ''}`
  projects.appendChild(article)
})

document.querySelectorAll('.app').forEach((el) => {
  el.style.display = 'none'
})

function init() {
  var app = document.querySelectorAll('.app'),
    page = document.querySelectorAll('.page')

  document.querySelectorAll('article img:not(.locked)').forEach((el) => {
    el.onclick = function (e) {
      var desc = el.nextElementSibling.nextElementSibling
      desc.classList.toggle("opened")
      desc.onclick = function (e) {
        desc.classList.toggle("opened")
      }
    }
  })

  document.querySelector('.nav-menu-item:nth-child(1)').onclick = function () {
    document.documentElement.style.setProperty('--count', Data.count.page)
    page.forEach((el) => {
      el.style.display = 'block'
    })
    app.forEach((el) => {
      el.style.display = 'none'
    })
  }
  document.querySelector('.nav-menu-item:nth-child(2)').onclick = function () {
    document.documentElement.style.setProperty('--count', Data.count.app)
    page.forEach((el) => {
      el.style.display = 'none'
    })
    app.forEach((el) => {
      el.style.display = 'block'
    })
  }

  document.querySelectorAll('.app').forEach((el, i) => {
    var a = document.querySelectorAll('.app h2 a')[i]
    a.onclick = function (e) {
      e.preventDefault()
      if (!el.view.disabled) {
        initDownloadPage(el.view)
      }
    }

  })
}


init()
document.documentElement.addEventListener("resize", init, false)
window.addEventListener('resize', init, false)
