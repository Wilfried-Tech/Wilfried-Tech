async function initLogin() {
  const loginContainer = $('.login-container');
  const stockage = new JStorage(JStorage.LOCAL);

  var userInfo = stockage.getItem('WilfriedroidUser');

  if (!userInfo) {
    loginContainer.css('display', 'block');
    loginContainer.children[0].onsubmit = function(e) {
      var data = new FormData(this);
      Ajax('POST', API.Users, AjaxData({
        action: 'POST',
        name: data.get('name'),
        password: data.get('password'),
        email: data.get('email')
      })).then(response => {
        stockage.setItem('WilfriedroidUser', JSON.stringify({
          name: data.get('name'),
          password: data.get('password'),
          email: data.get('email')
        }))
        window.location.reload();
      }).catch(e => {
        console.error(e);
      });
      e.preventDefault();
    }
  } else {
    var $user = JSON.parse(stockage.getItem('WilfriedroidUser'));

    Ajax('POST', API.Users, AjaxData({
      action: 'GET',
      name: $user.name,
      password: $user.password,
      email: $user.email
    })).then(response => {
      $user = JSON.parse(response);
      User = new Utilisateur($user.self);
      User.Friends = new UtilisateurList($user.accounts);
      window.dispatchEvent(new CustomEvent('Logged'));
    }).catch(reason => {
      console.error(reason);
      alert('impossible de te connecter automatiquement vérifier votre connexion Internet et réessayer');
      loginContainer.css('display', 'block');
    })
  }
}