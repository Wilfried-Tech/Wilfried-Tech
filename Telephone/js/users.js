class Utilisateur {
  constructor(data, active = true) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.online = data.online
    this.seen = new Date(data.seen);
    if (active) {
      this.config = /\{|\}|\"/.test(`${data.config}`) ? JSON.parse(data.config) : {}
      this.others = /\{|\}|\"/.test(`${data.others}`) ? JSON.parse(data.others) : {}
      this.motPasse = data.password
    }
  }
  exportData() {
    var data = {};
    data.name = this.name
    data.id = this.id
    data.email = this.email
    data.online = this.online ? 1 : 0;
    data.config = JSON.stringify(this.config);
    data.others = JSON.stringify(this.others)
    data.password = this.motPasse;
    data.action = 'PUT'
    data.authname = 'Wilfried-Tech'
    data.authpass = 'jtmlucie63'
    Ajax('post', API.Users, AjaxData(data)).then(console.log)
  }
}

class UtilisateurList {
  constructor(list) {
    this.accounts = [];
    list.forEach(((user) => this.accounts.push(new Utilisateur(user, false))).bind(this))
  }
  getUserByName(name) {
    for (var index in this.accounts) {
      if (this.accounts[index].name == name) {
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