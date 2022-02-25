async function initLogin() {
  function loginUser($user) {
    Ajax('POST', API.Users, AjaxData({
      action: 'GET',
      name: $user.name,
      password: $user.password,
      email: $user.email
    })).then(response => {
      $user = JSON.parse(response);
      User = new Utilisateur($user.self);
      User.Friends = new UtilisateurList($user.accounts);
      User.online = 1;
      User.exportData();
      window.dispatchEvent(new CustomEvent('Logged'));
    }).catch(reason => {
      console.error(reason);
      alert('impossible de te connecter automatiquement vérifier votre connexion Internet et réessayer');
    })
  }

  function onsubmit(e) {
    var data = new FormData(this);
    Ajax('POST', API.Users, AjaxData({
      action: 'POST',
      name: data.get('name'),
      password: data.get('password'),
      email: data.get('email')
    })).then(response => {
      var store = stockage.getItem('WilfriedroidUser');
      store = JSON.parse(store) || [];
      store.push({
        name: data.get('name'),
        password: data.get('password'),
        email: data.get('email')
      })
      stockage.setItem('WilfriedroidUser', JSON.stringify(store));

      window.location.reload();
    }).catch(e => {
      console.error(e);
    });
    e.preventDefault();
  }
  const loginContainer = $('.login-container');
  const form = $('.login-container form');
  const loggedAccounts = $('.login-container .phone-account-logged');
  const logged = $('.phone-account-logged >fieldset');

  const stockage = new JStorage(JStorage.LOCAL);

  var userInfo = stockage.getItem('WilfriedroidUser');

  if (!userInfo) {
    loginContainer.css('display', 'block');
    form.css('display', 'block');

    form.onsubmit = onsubmit;
  } else {
    var $user = JSON.parse(stockage.getItem('WilfriedroidUser'));

    loginContainer.css('display', 'block');
    loggedAccounts.css('display', 'block');

    if (!$user.push) {
      $user = [$user];
      stockage.setItem('WilfriedroidUser', JSON.stringify($user))
    }
    /*if ($user.length == 1) {
      loginUser($user[0]);
    } else {*/
    $user.forEach((_user, i) => {
      (function(_user, i) {
        logged.appendChild(createElement('fieldset', {
          text: `<legend><label>compte ${i+1}</label></legend><div class="account" ><div class="user-img"><i class="fa fa-circle-user"></i></div><div class="user-name">${_user.name}</div><div class="user-email">${_user.email}</div></div>`
        }, {
          onclick: function() {
            loginUser(_user);
            loginContainer.css('display', 'none');
          }
        }))
      })(_user, i);
    });
    logged.appendChild(createElement('fieldset', {
      text: `<legend><label>cree un compte</label></legend><div class="account" ><div class="user-img"><i class="fa fa-user-plus"></i></div><div class="user-name">ajouter</div><div class="disc-email">un nouveau compte</div></div>`
    }, {
      onclick: function() {
        loggedAccounts.css('display', 'none');
        form.css('display', 'block');
        form.onsubmit = onsubmit;
      }
    }))
    //}
  }
}