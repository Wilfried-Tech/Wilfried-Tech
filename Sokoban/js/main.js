const canvas = document.querySelector('#cvs')
const Game = new Sokoban(canvas);

var sprites = new Sokoban.Sprites();

sprites.setSpriteDir('assets/images/src');

sprites.setBox('caisse.png');
sprites.setBoxOk('caisse_ok.png');
sprites.setGround('land.jpg');
sprites.setTarget('objectif.png');
sprites.setWall('mur.png');
sprites.setTree('arbre.png');
sprites.setMarioUp('mario_haut.png');
sprites.setMarioDown('mario_bas.png');
sprites.setMarioLeft('mario_gauche.png');
sprites.setMarioRight('mario_droite.png');

Game.setSprite(sprites);

Game.loadMapFromAssets('assets/map/map.json');

Game.onload = function(e) {
  Game.level = 4;
    Game.start();
}

const Control = {
  Left: document.querySelector('.control .left'),
  Right: document.querySelector('.control .right'),
  Up: document.querySelector('.control .up'),
  Down: document.querySelector('.control .down')
}

Control.Up.addEventListener('click', (e) => {
  Game.moveSprites(Sokoban.Sprites.DIR_UP);
  Game.render();
})
Control.Down.addEventListener('click', (e) => {
  Game.moveSprites(Sokoban.Sprites.DIR_DOWN);
  Game.render();
})
Control.Left.addEventListener('click', (e) => {
  Game.moveSprites(Sokoban.Sprites.DIR_LEFT);
  Game.render();
})
Control.Right.addEventListener('click', (e) => {
  Game.moveSprites(Sokoban.Sprites.DIR_RIGHT);
  Game.render();
})

Game.onLevelTeminated = function(e) {
  if (this.level + 1 < this.levels.length) {
    this.level++;
    this.start();
  } else {
    alert('vous avez terminé tous les niveaux');
  }
}