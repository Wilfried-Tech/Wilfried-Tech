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
      this.password = data.password
    }
  }
  exportData() {

    Ajax('post', API.Users, AjaxData({
      name: this.name,
      id: this.id,
      email: this.email,
      online: this.online ? 1 : 0,
      config: JSON.stringify(this.config),
      others: JSON.stringify(this.others),
      password: this.password,
      action: 'PUT'
    })).then(console.log)
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