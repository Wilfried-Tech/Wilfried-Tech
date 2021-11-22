var Data = {
  app: [{
    name: "convertisseur",
    long_name: "convertisseur",
    downloadName: "converter.apk",
    link: "https://github.com/Wilfried-Tech/Public_Creation/releases/download/v1.2/Convertisseur.apk",
    size: '64.09 ko',
    rate: 3,
    min_age: 5,
    nb_download: 2,
    description: {
      title: "convertisseur",
      text: "C'est Une Application Développer Par Moi En Vu De Vous Aider A Convertir Les Chiffres En Lettres . Mais Le Problème C'est Que Elle Ne Convertir Que Les Chiffres Compris Entre 0 Et 999 ."
    },
    icon: {
      name: "converter",
      url: "app/Convertisseur/convertisseur_logo.png"
    },
    disabled: false,
    prev: []
   }],
  page: [{
      name: "Wilfriedroid",
      link: "Telephone/",
      description: {
        title: "Wilfriedroid",
        text: "Wilfried-Tech mets sur pieds la marque d'Android wilfried-Tech , c'est un téléphone virtuel !"
      },
      icon: {
        name: "Wilfriedroid",
        url: "Telephone/assets/images/favicon/favicon.png"
      },
      type: "Tools",
      disabled: false
   },
    {
      name: "Equation",
      link: "Equation/",
      description: {
        title: "equation",
        text: "le resolveur d'équation est un outils puissant qui va vous permettre de résoudre des équations a n inconnu !"
      },
      icon: {
        name: "Equation",
        url: "Equation/assets/images/favicon/favicon.png"
      },
      type: "math",
      disabled: false
  },
    {
      name: "Sokoban",
      link: "Sokoban/",
      description: {
        title: "sokoban",
        text: "Sokoban Est Un Jeux 2d. Dont L'objectif Est De Ranger Les Caisses Au Endroit Prevu Pour Cela."
      },
      icon: {
        name: "sokoban",
        url: "Sokoban/assets/images/favicon/favicon.png"
      },
      type: 'game',
      disabled: false
   },
    {
      name: "IconsPicker",
      link: "IconsPicker/",
      description: {
        title: "IconsPicker",
        text: "Wilfried-Tech vous facilite la vie en vous proposant une liste complète et recente des d'icone de vos Bibliothèque favori ."
      },
      icon: {
        name: "IconsPicker",
        url: "IconsPicker/assets/images/favicon/favicon.png"
      },
      type: "dev",
      disabled: true
   }]
};

Data.count = {
  app: Data.app.length,
  page: Data.page.length
};

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