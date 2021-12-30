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
    this.game = this.levels[this.level];
    this.cvs.width = this.size * this.game.map[0].length;
    this.cvs.height = this.size * this.game.map.length;
    this.render();
  }
  /**
   * 
   */
  render() {
    this.setGround();
    
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

  onwin(event) {}
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

    console.log(this);
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