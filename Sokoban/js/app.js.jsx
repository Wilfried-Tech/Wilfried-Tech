function listener(elt, e, fun) {
  elt.addEventListener(e, fun, false)
};

function Path(src) {
  return 'assets/images/src/' + src + '.png';
};

function getPosition(element) {
  var top = 0,
    left = 0;

  do {
    top += element.offsetTop;
    left += element.offsetLeft;
  } while (element = element.offsetParent);

  return { x: left, y: top };
}



function getMousePosition(event) {
  return {
    x: event.pageX,
    y: event.pageY
  };
}

function getLevel(index) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", './maps/level' + index + '.json');
  xhr.send();
  return new Promise((resolve) => {
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        resolve(JSON.parse(xhr.responseText));
      }
    }
  });
}

const B = 1,
  W = 2,
  M = 3,
  V = 0,
  T = 4,
  O = 5,
  A = 6;




function GAME(id, data) {
  SPRITE.call(this);

  this.map = data.map;
  this.player = data.mario;
  this.targets = data.target;
  this.cvs = (id) ? document.querySelector(id) : document.querySelector('#renderCanvas');
  this.engine = this.cvs.getContext('2d');

  this.init();
  this.onresize();
}

GAME.prototype = {
  onresize: function() {
    listener(window, 'resize', this.init)
  },
  draw: function(img, x, y) {
    if (img.complete) {
      this.engine.drawImage(img, x * this.size, y * this.size, this.size, this.size);
    } else {
      listener(img, 'load', () => {
        this.engine.drawImage(img, x * this.size, y * this.size, this.size, this.size)
      });
    }
  },
  render: function() {

    
  init: function() {
    this.cvs.width = this.size * this.map[0].length;
    this.cvs.height = this.size * this.map.length;
    this.render();
  }
}

GAME.prototype.nextCase = function(dir) {
  var Case1 = {},
    Case2 = {};
  Case1.x = Case2.x = this.player.x
  Case1.y = Case2.y = this.player.y

  switch (dir) {
    case 'up':
      Case1.y--;
      Case2.y = Case1.y - 1;
      break;
    case 'down':
      Case1.y++;
      Case2.y = Case1.y + 1;
      break;
    case 'left':
      Case1.x--;
      Case2.x = Case1.x - 1;
      break;
    case 'right':
      Case1.x++;
      Case2.x = Case1.x + 1;
      break;
  }
  Case1.$ = this.map[Case1.y][Case1.x];
  Case2.$ = this.map[Case2.y][Case2.x];
  return [Case1, Case2];
};

// GAME.prototype.IsIn = function(bloc) {
//   var map = this.map;
//   if (blo.x < 0 || bloc.y < 0 || bloc.x >= map[0].length || bloc.y >= map.length) {
//     return false;
//   } else {
//     return true;
//   }
// };

GAME.prototype.move = function(dir) {
  this.MARIO = this.Mario[dir]
  var x = this.player.x,
    y = this.player.y,
    Cases = this.nextCase(dir);
  Case1 = Cases[0],
    Case2 = Cases[1],
    m = this.map;

  if (Case1.$ != W) {
    if (Case1.$ == V || Case1.$ == T) {
      m[y][x] = V
      m[Case1.y][Case1.x] = M
      this.ChangePos(dir);
    }
    if (Case1.$ == B) {
      if (Case2.$ != W) {
        if (Case2.$ == V) {
          m[y][x] = V;
          m[Case1.y][Case1.x] = M;
          m[Case2.y][Case2.x] = B;
          this.ChangePos(dir);
        }
        if (Case2.$ == T) {
          m[y][x] = V;
          m[Case1.y][Case1.x] = M;
          m[Case2.y][Case2.x] = O;
          this.ChangePos(dir);
        }
      }
    }
    if (Case1.$ == O) {
      if (Case2.$ != W) {
        if (Case2.$ == V) {
          m[y][x] = V;
          m[Case1.y][Case1.x] = M;
          m[Case2.y][Case2.x] = B;
          this.ChangePos(dir);
        }
        if (Case2.$ == T) {
          m[y][x] = V;
          m[Case1.y][Case1.x] = M;
          m[Case2.y][Case2.x] = O;
          this.ChangePos(dir);
        }
      }
    }
  }
};

GAME.prototype.ChangePos = function(dir) {
  switch (dir) {
    case 'up':
      this.player.y--;
      break;
    case 'down':
      this.player.y++;
      break;
    case 'left':
      this.player.x--;
      break;
    case 'right':
      this.player.x++;
      break;
  }
};

GAME.prototype.

GAME.prototype.IsWin = function() {
  var t = this.targets,
    count = 0;
  for (var i = 0, l = t.length; i < l; i++) {
    var cx = t[i][0],
      cy = t[i][1];
    if (this.map[cy][cx] == O) {
      count++
    }
  }
  if (count == t.length) {
    return true;
  } else {
    return false;
  }
};

GAME.prototype.getDirection = function(x, y) {
  var w = this.cvs.width,
    h = this.cvs.height,
    dir = "none",
    box1 = {
      x: w / 5,
      y: 0,
      w: (w * 3) / 5,
      h: (h / 5)
    };
  console.log(box1);

  if (x >= box1.x && x < box1.x + box1.w && y >= box1.y && y < box1.y + box1.h) {
    dir = "up"
  }


  //alert(dir)
}