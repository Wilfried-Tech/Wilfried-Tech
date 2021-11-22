/*const B = 1
        W = 2
        M = 3
        V = 0
        T = 4
        O = 5
        A = 6
*/
const KEY_DOWN = 40,
  KEY_UP = 38,
  KEY_LEFT = 37,
  KEY_RIGHT = 39,
  KEY_END = 35,
  KEY_BEGIN = 36,
  KEY_BACK_TAB = 8,
  KEY_TAB = 9,
  KEY_SH_TAB = 16,
  KEY_ENTER = 13,
  KEY_ESC = 27,
  KEY_SPACE = 32,
  KEY_DEL = 46,
  KEY_A = 65,
  KEY_B = 66,
  KEY_C = 67,
  KEY_D = 68,
  KEY_E = 69,
  KEY_F = 70,
  KEY_G = 71,
  KEY_H = 72,
  KEY_I = 73,
  KEY_J = 74,
  KEY_K = 75,
  KEY_L = 76,
  KEY_M = 77,
  KEY_N = 78,
  KEY_O = 79,
  KEY_P = 80,
  KEY_Q = 81,
  KEY_R = 82,
  KEY_S = 83,
  KEY_T = 84,
  KEY_U = 85,
  KEY_V = 86,
  KEY_W = 87,
  KEY_X = 88,
  KEY_Y = 89,
  KEY_Z = 90;


var btn = document.querySelectorAll('.btn');

const Btn = {
  up: btn[0],
  left: btn[1],
  right: btn[2],
  down: btn[3]
};
var Game, level = 1,
  start = true;
getLevel(level).then(data => {
  Game = new GAME('#cvs', data);
});


for (var dir in Btn) {
  (function(dir) {
    if(start){
    Btn[dir].onclick = function() {
      Game.move(dir);
      Game.render();
      if (Game.IsWin()) {
        start=false;
        alert('Vous avez réussir le niveau №: '+level+'\n Voyons comment vous allez faire au niveau №: '+(level+1));
        if((level+1)<5){
          level++
        } else{
          alert('Vous avez réussir tout les niveau \n j\'espère que vous que vous vous êtes bien amusé 😉' );
        }
        getLevel(level).then(data => {
          Game = new GAME('#cvs', data);
          start=true;
        });
      }
    }}
  })(dir);
}


listener(window, 'keyup', (e) => {
  switch (e.keyCode) {
    case KEY_UP:
    case KEY_Z:
      Game.move('up');
      break;
    case KEY_DOWN:
    case KEY_S:
      Game.move('down');
      break;
    case KEY_LEFT:
    case KEY_Q:
      Game.move('left');
      break;
    case KEY_RIGHT:
    case KEY_D:
      Game.move('right');
      break;
    case KEY_ESC:
      window.close();
      break;
  }
  Game.render();
  if (Game.IsWin()) {
    start = false;
    alert('Vous avez réussir le niveau №: ' + level + '\n Voyons comment vous allez faire au niveau №: ' + (level + 1));
    if ((level + 1) < 5) {
      level++
    } else {
      alert('Vous avez réussir tout les niveau \n j\'espère que vous que vous vous êtes bien amusé 😉');
    }
    getLevel(level).then(data => {
      Game = new GAME('#cvs', data);
      start = true;
    });
  }
});

/*
listener(document.querySelector('#cvs'), 'click', (e) => {
    var click = getMousePosition(e),
      eltPos = getPosition(Game.cvs),
      cx = click.x - eltPos.x,
      cy = click.y - eltPos.y
      //,dir = Game.getDirection(cx, cy);
      ;
      
    alert(eltPos.x+' '+eltPos.y)
});
*/
/*
screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

if (screen.lockOrientationUniversal(["landscape-primary", "landscape-secondary"])) {
  // Orientation was locked
} else {
  // Orientation lock failed
}*/
