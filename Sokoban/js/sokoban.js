/**
 * Create and initialisate a Sokoban game
 * 
 * @class
 */

class Sokoban {
  /**
   * create an instance of Sokoban
   * @param {HTMLCanvasElement} canvas the drawing surface
   */
  constructor(canvas) {
    this.cvs = canvas;
    this.engine = canvas.getContext('2d');
    this.size = Math.min(window.innerWidth, window.innerHeight) / 10;
    this.levels = [];
    this.level = 1;
    this.sprites = null;
    this.game = null;
    this.Mario = null;
  }
  /**
   * load levels map from JSON files
   * @param {String} path the path of map
   */
  loadMapFromAssets(path) {
    var $this = this;
    fetch(path, {
      method: 'GET',
      cache: 'no-cache'
    }).then(async response => {
      if (response.ok) {
        $this.levels = await response.json();
        this.onload($this);
      }
    })
  }
  /**
   * set Sokoban sprites
   * @param {Sokoban.Sprites} sprites
   */
  async setSprite(sprites) {
    this.sprites = sprites;
    this.Mario = sprites.MarioDown;
    /*
        var promises = [],
          $this = this;
        for (var name in sprites) {
          if (sprites[name] instanceof Image) {
            promises.push(new Promise((revolve, reject) => {
              sprites[name].onload = revolve;
              sprites[name].onerror = reject;
            }))
          }
        }
        await Promise.all(promises).then(response => {
          $this.sprites = sprites;
          console.log(response);
        }).catch(console.log);*/
  }
  /**
   * draw an image on a canvas
   * @param {Image} img
   * @param {Number} x
   * @param {Number} y
   */
  draw(img, x, y) {
    var $this = this;
    if (img.complete) {
      $this.engine.drawImage(img, x * $this.size, y * $this.size, $this.size, $this.size);
    } else {
      img.addEventListener('load', () => {
        $this.engine.drawImage(img, x * $this.size, y * $this.size, $this.size, $this.size)
      });
    }
  }
  /**
   * 
   */
  start() {
    this.game = this.levels[this.level - 1];
    this.cvs.width = this.size * this.game.map[0].length;
    this.cvs.height = this.size * this.game.map.length;
    this.render();
  }
  /**
   * 
   */
  render() {
    this.setGround();
    this.updateTargets();
    var speed = 0;
    for (var y = 0; y < this.game.map.length; y++) {
      for (var x = 0; x < this.game.map[0].length; x++) {
        /*  (function(x, y) {
            setTimeout((function() {
              setTimeout((function() { */
        switch (this.game.map[y][x]) {
          case Sokoban.Sprites.VOID:
            break;
          case Sokoban.Sprites.WALL:
            this.draw(this.sprites.Wall, x, y);
            break;
          case Sokoban.Sprites.BOX:
            this.draw(this.sprites.Box, x, y);
            break;
          case Sokoban.Sprites.TARGET:
            this.draw(this.sprites.Target, x, y);
            break;
          case Sokoban.Sprites.BOX_OK:
            this.draw(this.sprites.BoxOk, x, y);
            break;
          case Sokoban.Sprites.MARIO:
            this.draw(this.Mario, x, y);
            break;
          case Sokoban.Sprites.TREE:
            this.draw(this.sprites.Tree, x, y);
            break;
        }
        /*  }).bind(this), x * speed);
          }).bind(this), y * this.game.map[0].length*speed);
        }).bind(this)(x, y);*/
      }
    }
    this.checkLevelTerminated();
  }
  /**
   * 
   */
  setGround() {
    for (var x = 0; x < this.game.map[0].length; x++) {
      for (var y = 0; y < this.game.map.length; y++) {
        this.draw(this.sprites.Ground, y, x);
      }
    }
  }
  /**
   * 
   */
  updateTargets() {
    const Sprites = Sokoban.Sprites;
    var targets = this.game.target;
    for (var i = 0, l = targets.length; i < l; i++) {
      var cx = targets[i][0],
        cy = targets[i][1];

      if (this.game.map[cy][cx] != Sprites.BOX_OK) {
        this.draw(this.sprites.Target, cx, cy);
      }
      if (this.game.map[cy][cx] == Sprites.VOID) {
        this.game.map[cy][cx] = Sprites.TARGET;
      }
    }
  }
  /**
   * 
   */
  nextCases(dir) {
    var Case1 = {},
      Case2 = {},
      map = {};
    Case1.x = Case2.x = this.game.player.x
    Case1.y = Case2.y = this.game.player.y
    map.sizeY = this.game.map.length;
    map.sizeX = this.game.map[0].length;

    switch (dir) {
      case Sokoban.Sprites.DIR_UP:
        Case1.y--;
        Case2.y = Case1.y - 1;
        break;
      case Sokoban.Sprites.DIR_DOWN:
        Case1.y++;
        Case2.y = Case1.y + 1;
        break;
      case Sokoban.Sprites.DIR_LEFT:
        Case1.x--;
        Case2.x = Case1.x - 1;
        break;
      case Sokoban.Sprites.DIR_RIGHT:
        Case1.x++;
        Case2.x = Case1.x + 1;
        break;
    }
    Case2.x = (Case2.x < 0) ? Case1.x : Case2.x;
    Case2.y = (Case2.y < 0) ? Case1.y : Case2.y;

    Case2.x = (Case2.x >= map.sizeX) ? Case1.x : Case2.x;
    Case2.y = (Case2.y >= map.sizeY) ? Case1.y : Case2.y;

    Case1.$ = this.game.map[Case1.y][Case1.x];
    Case2.$ = this.game.map[Case2.y][Case2.x];

    return [Case1, Case2];
  }
  /**
   * 
   */
  moveSprites(dir) {
    var x = this.game.player.x,
      y = this.game.player.y;
    var [Case1, Case2] = this.nextCases(dir);
    var map = this.game.map;

    if (Case1.$ != Sokoban.Sprites.WALL) {
      if (Case1.$ == Sokoban.Sprites.VOID || Case1.$ == Sokoban.Sprites.TARGET) {
        map[y][x] = Sokoban.Sprites.VOID
        map[Case1.y][Case1.x] = Sokoban.Sprites.MARIO
        this.changePlayerPosition(dir);
      }
      if (Case1.$ == Sokoban.Sprites.BOX) {
        if (Case2.$ != Sokoban.Sprites.WALL) {
          if (Case2.$ == Sokoban.Sprites.VOID) {
            map[y][x] = Sokoban.Sprites.VOID;
            map[Case1.y][Case1.x] = Sokoban.Sprites.MARIO;
            map[Case2.y][Case2.x] = Sokoban.Sprites.BOX;
            this.changePlayerPosition(dir);
          }
          if (Case2.$ == Sokoban.Sprites.TARGET) {
            map[y][x] = Sokoban.Sprites.VOID;
            map[Case1.y][Case1.x] = Sokoban.Sprites.MARIO;
            map[Case2.y][Case2.x] = Sokoban.Sprites.BOX_OK;
            this.changePlayerPosition(dir);
          }
        }
      }
      if (Case1.$ == Sokoban.Sprites.BOX_OK) {
        if (Case2.$ != Sokoban.Sprites.WALL) {
          if (Case2.$ == Sokoban.Sprites.VOID) {
            map[y][x] = Sokoban.Sprites.VOID;
            map[Case1.y][Case1.x] = Sokoban.Sprites.MARIO;
            map[Case2.y][Case2.x] = Sokoban.Sprites.BOX;
            this.changePlayerPosition(dir);
          }
          if (Case2.$ == Sokoban.Sprites.TARGET) {
            map[y][x] = Sokoban.Sprites.VOID;
            map[Case1.y][Case1.x] = Sokoban.Sprites.MARIO;
            map[Case2.y][Case2.x] = Sokoban.Sprites.BOX_OK;
            this.changePlayerPosition(dir);
          }
        }
      }
    }
  }
  changePlayerPosition(dir) {
    switch (dir) {
      case Sokoban.Sprites.DIR_UP:
        this.game.player.y--;
        this.Mario = this.sprites.MarioUp;
        break;
      case Sokoban.Sprites.DIR_DOWN:
        this.game.player.y++;
        this.Mario = this.sprites.MarioDown;
        break;
      case Sokoban.Sprites.DIR_LEFT:
        this.game.player.x--;
        this.Mario = this.sprites.MarioLeft;
        break;
      case Sokoban.Sprites.DIR_RIGHT:
        this.game.player.x++;
        this.Mario = this.sprites.MarioRight;
        break;
    }
  };
  checkLevelTerminated() {
    var targets = this.game.target,
      count = 0;
    for (var i = 0, l = targets.length; i < l; i++) {
      var cx = targets[i][0],
        cy = targets[i][1];
      if (this.game.map[cy][cx] == Sokoban.Sprites.BOX_OK) {
        count++
      }
    }
    if (count == targets.length) {
      this.onLevelTeminated();
    }
  }
  /**
   * 
   */
  onLevelTeminated(event) {}
  /**
   * 
   */
  onload(event) {}
}

Sokoban.Sprites = class {
  constructor() {
    this.Ground = new Image();
    this.Wall = new Image();
    this.Box = new Image();
    this.BoxOk = new Image();
    this.Target = new Image();
    this.Tree = new Image();
    this.MarioUp = new Image();
    this.MarioLeft = new Image();
    this.MarioRight = new Image();
    this.MarioDown = new Image();
    this.spriteDir = '.';
  }
  setSpriteDir(path) {
    this.spriteDir = path;
  }
  setWall(url) {
    this.Wall.src = this.spriteDir + '/' + url;
  }
  setGround(url) {
    this.Ground.src = this.spriteDir + '/' + url;
  }
  setTarget(url) {
    this.Target.src = this.spriteDir + '/' + url;
  }
  setTree(url) {
    this.Tree.src = this.spriteDir + '/' + url;
  }
  setBox(url) {
    this.Box.src = this.spriteDir + '/' + url;
  }
  setBoxOk(url) {
    this.BoxOk.src = this.spriteDir + '/' + url;
  }
  setMarioUp(url) {
    this.MarioUp.src = this.spriteDir + '/' + url;
  }
  setMarioDown(url) {
    this.MarioDown.src = this.spriteDir + '/' + url;
  }
  setMarioLeft(url) {
    this.MarioLeft.src = this.spriteDir + '/' + url;
  }
  setMarioRight(url) {
    this.MarioRight.src = this.spriteDir + '/' + url;
  }
}

Sokoban.Sprites.BOX = 1
Sokoban.Sprites.BOX_OK = 5
Sokoban.Sprites.WALL = 2
Sokoban.Sprites.TARGET = 4
Sokoban.Sprites.TREE = 6
Sokoban.Sprites.MARIO = 3
Sokoban.Sprites.VOID = 0;

Sokoban.Sprites.DIR_UP = 0
Sokoban.Sprites.DIR_DOWN = 1
Sokoban.Sprites.DIR_LEFT = 2
Sokoban.Sprites.DIR_RIGHT = 3