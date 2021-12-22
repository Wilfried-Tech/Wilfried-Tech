class Lockscreen extends Interface {
  constructor($interface) {
    super($interface);

    this.watchDate = this.select('.watch-date');
    this.watchTime = this.select('.watch-time');
    this.lockscreenMain = this.activities[0];
    this.lockscreenPin = this.activities[1];
    this.watchTime.innerText = Android.time.time;
    this.watchDate.innerHTML = Android.time.format();
  }
  onCreate() {
    var $this = this;

    this.NodeElement.addEventListener('phone-timechange', (e) => {
      this.watchTime.innerText = e.detail.time;
      this.watchDate.innerHTML = e.detail.format();
    })

    registerForSwipeEvent(this.lockscreenMain);
    registerForSwipeEvent(this.lockscreenPin);

    this.lockscreenMain.onswipe = function(e) {
      var detail = e.detail;
      if (detail.direction == 'up' && !phone.topBar.classList.contains('topbar-open') && e.detail.distance >= 100) {
        $this.lockscreenMain.css('transform', `translateY(-${Android.height}px)`);
        $this.lockscreenPin.css('transform', `translateY(-${Android.height}px)`);
        setTimeout(() => {
          $this.select('.pin-message').style.display = 'none';
        }, 2000);
      }
    }
    this.lockscreenPin.onswipe = function(e) {
      var detail = e.detail;
      if (detail.direction == 'down' && !phone.topBar.classList.contains('topbar-open') && e.detail.distance >= 100) {
        $this.lockscreenMain.css('transform', 'translateY(0)');
        $this.lockscreenPin.css('transform', 'translateY(0)');
      }
    }
    var input = $this.select('.pin-input input');
    input.disabled = true;
    var errorCount = 0,
      lockCount = 0;
    this.select('.key', '*').forEach(elt => {
      elt.onclick = function() {
        if (elt.classList.contains('key-del')) {
          input.value = input.value.substring(0, input.value.length - 1);
        } else if (elt.classList.contains('key-ok')) {
          if (Android.password == input.value) {
            input.value = '';
            Android.displayInterface('window').then(() => $this.NodeElement.remove());
          } else {
            input.value = '';
            errorCount++;
            $this.select('.pin-message').style.display = 'block';
            $this.select('.pin-message-indication').style.display = 'none';
            $this.select('.pin-message-error').classList.toggle('invalid');
            $this.select('.pin-message-error').innerHTML = 'mot de pass incorrect !'
            if (errorCount == 5) {
              $this.select('#keyboard').style.visibility = 'hidden';
              input.style.visibility = 'hidden';
              elt.style.visibility = 'hidden'
              errorCount = 0;
              lockCount++;
              var second = 3;
              var interval = setInterval(() => {
                $this.select('.pin-message-error').innerHTML = 'veillez reessayer dans ' + second + ' secondes'
                second--;
                if (second == -1) {
                  clearInterval(interval);
                  $this.select('#keyboard').style.visibility = 'visible';
                  input.style.visibility = 'visible';
                  $this.select('.pin-message').style.display = 'none';
                  $this.select('.pin-message-error').classList.toggle('invalid');
                  elt.style.visibility = 'visible'
                }
              }, 1000)
            } else {
              elt.style.visibility = 'hidden';
              setTimeout(() => {
                $this.select('.pin-message-error').classList.toggle('invalid');
                $this.select('.pin-message').style.display = 'none';
                elt.style.visibility = 'visible'
              }, 2000)
            }
            if (lockCount == 5) {
              lockCount = 0
              lockscreenPin.style.display = 'none';
              alert('veillez contacter Mr Wilfried pour plus d\'informations !');
            }
          }
        } else {
          input.value += elt.innerText;
        }
      }
    })
    ripple(this.select('#keyboard>*', '*'));
    ripple(this.select('.emergency', '*'));

  }
}

Interface.Lockscreen = Lockscreen;