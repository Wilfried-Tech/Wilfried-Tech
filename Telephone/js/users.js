class Utilisateur {
  constructor(data, active = true) {
    this.id = data.id
    this.nom = data.nom
    this.email = data.email
    this.enligne = data.enligne
    this.vu = new Date(data.vu);
    if (active) {
      this.config = /\{|\}|\"/.test(`${data.donnees}`) ? JSON.parse(data.donnees) : {}
      this.autres = /\{|\}|\"/.test(`${data.autres}`) ? JSON.parse(data.autres) : {}
      this.motPasse = data.password
    }
  }
  exportData() {
    var data = {};
    data.nom = this.nom
    data.id = this.id
    data.email = this.email
    data.enligne = this.enligne? 1: 0;
    data.donnees = JSON.stringify(this.config);
    data.autres = JSON.stringify(this.autres)
    data.password = this.motPasse;
    data.action = 'PUT'
    data.authname = 'Wilfried-Tech'
    data.authpass = 'jtmlucie63'
    Ajax('post', 'https://wilfried-tech.000webhostapp.com/API/Wilfriedroid/Messages/index.phpindex.php', AjaxData(data)).then(console.log)
  }
}

class UtilisateurList {
  constructor(list) {
    this.accounts = [];
    list.forEach(((user) => this.accounts.push(new Utilisateur(user, false))).bind(this))
  }
  getUserByName(name) {
    for (var index in this.accounts) {
      if (this.accounts[index].nom == name) {
        return this.accounts[index]
      }
    }
  }
  getUserById(id) {
    for (var index in this.accounts) {
      if (this.accounts[index].id == id) {
        return this.accounts[index]
      }
    }
  }
}