//This isn't being used yet cause I don't feel like it.

function Player(game){
  this.game = game;
  this.sprite = null;
}

Player.prototype.create = function() {
  this.sprite = this.game.add.sprite(0, 0, 'knightwalkjump', 0);
  game.physics.enable(this, Phaser.Physics.ARCADE);
}

Player.prototype.update = function(enemieGroup) {
  this.sprite.collide(enemieGroup);
}
