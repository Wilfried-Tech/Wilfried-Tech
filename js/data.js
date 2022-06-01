var Data = {
  app: [{
    name: "convertisseur",
    long_name: "convertisseur",
    downloadName: "converter.apk",
    link: "https://github.com/Wilfried-Tech/Wilfried-Tech/releases/download/v1.2/Convertisseur.apk",
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
      url: "app/Convertisseur/convertisseur_logo_old.png"
    },
    disabled: !false,
    prev: []
   }],
  page: [{
      name: "Wilfriedroid",
      link: "https://wilfried-tech.github.io/Wilfriedroid/",
      description: {
        title: "Wilfriedroid",
        text: "Wilfried-Tech mets sur pieds la marque d'Android wilfried-Tech , c'est un téléphone virtuel !"
      },
      icon: {
        name: "Wilfriedroid",
        url: "https://wilfried-tech.github.io/Wilfriedroid/assets/images/favicon/favicon.png"
      },
      type: "Tools",
      disabled: false
   },
    {
      name: "Equation",
      link: "https://wilfried-tech.github.io/Equation-Solver/",
      description: {
        title: "equation",
        text: "le resolveur d'équation est un outils puissant qui va vous permettre de résoudre des équations a n inconnu !"
      },
      icon: {
        name: "Equation",
        url: "https://wilfried-tech.github.io/Equation-Solver/assets/images/favicon/favicon.png"
      },
      type: "math",
      disabled: false
  },
    {
      name: "Sokoban",
      link: "https://wilfried-tech.github.io/Sokoban/",
      description: {
        title: "sokoban",
        text: "Sokoban Est Un Jeux 2d. Dont L'objectif Est De Ranger Les Caisses Au Endroit Prevu Pour Cela."
      },
      icon: {
        name: "sokoban",
        url: "https://wilfried-tech.github.io/Sokoban/assets/images/favicon/favicon.png"
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
