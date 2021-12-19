(async function() {
  async function getUsers() {
    var user = JSON.parse(stockage.getItem('WilfriedroidUser'));

    var response = await Ajax('POST', 'php/Users/', AjaxData({
      action: 'GET',
      nom: user.name,
      mdp: user.password,
      email: user.email,
      authname: 'Wilfried-Tech',
      authpass: 'jtmlucie63'
    }))
    if (!response) {
      alert('impossible de te connecter automatiquement réessayer plus tard !');
      return;
    }
    user = JSON.parse(response);
    Android.User = new Utilisateur(user.self);
    Android.UserList = new UtilisateurList(user.accounts);
    loginContainer.css('display', 'none');
  }
  const loginContainer = $('.login-container');
  const stockage = new JStorage(JStorage.LOCAL);
  var userInfo = stockage.getItem('WilfriedroidUser');
  if (!userInfo) {
    loginContainer.css('display', 'block');
    loginContainer.children[0].onsubmit = function(e) {
      var data = new FormData(this);
      Ajax('POST', 'php/Users/', AjaxData({
        action: 'POST',
        nom: data.get('nom'),
        mdp: data.get('mdp'),
        email: data.get('email'),
        authname: 'Wilfried-Tech',
        authpass: 'jtmlucie63'
      })).then(async (response) => {
        stockage.setItem('WilfriedroidUser', JSON.stringify({
          name: data.get('nom'),
          password: data.get('mdp'),
          email: data.get('email')
        }))
        await getUsers();
      }).catch(e => {
        console.error(e);
      });
      e.preventDefault();
      window.location.reload();
    }
  } else {
    await getUsers();
  }

})()