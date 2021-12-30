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
  Game.start();
}
