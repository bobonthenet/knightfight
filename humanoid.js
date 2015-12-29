function Humanoid (sprite, health, xpos, ypos) {
  this.health = health;
  this.sprite = game.add.sprite(xpos, ypos, sprite);
  this.sprite.status = 'new';
  this.sprite.animations.add('right', [0, 1, 2], 10, true);
  this.sprite.animations.add('left', [13, 12, 11], 10, true);
  this.sprite.animations.add('fightright', [6, 5, 4], 10, true);
  this.sprite.animations.add('fightleft', [7, 8, 9], 10, true);
  this.humanoidActions = humanoidActions;
  this.actionCounter = 0;
  this.sprite.moveDir = 'left';
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = true;
  this.sprite.body.bounce.y = 0.2;
  this.sprite.body.collideWorldBounds = true;
	this.sprite.knockedTo = 0;
	this.hitThisRound = false;

  this.dmgTextPool = game.add.group();
  var dmgText;
  for (var d=0; d<50; d++) {
      dmgText = game.add.text(0, 0, '1');
      dmgText.font = 'Press Start 2P';
      dmgText.fontSize = 16;
      // start out not existing, so we don't draw it yet
      dmgText.exists = false;
      dmgText.tween = game.add.tween(dmgText)
          .to({
              alpha: 0,
              y: 100,
              x: game.rnd.integerInRange(100, 700)
          }, 1000, Phaser.Easing.Cubic.Out);

      dmgText.tween.onComplete.add(function(text, tween) {
          text.kill();
      });
      this.dmgTextPool.add(dmgText);
  }
}

function humanoidActions(status) {

  this.sprite.status = status != undefined ? status : this.sprite.status
  game.physics.arcade.collide(this.sprite, collisionLayer);

  switch(this.sprite.status) {
    case 'new': // TODO: Change this to use this.sprite.body.velocity.x
      if(this.sprite.moveDir == 'left'){
        this.sprite.x -= 1
        this.sprite.animations.play('left');
      } else {
        this.sprite.x += 1
        this.sprite.animations.play('right');
      }
      this.actionCounter ++;

      if (this.actionCounter > 150 && this.sprite.moveDir == 'left')
      {
        this.sprite.moveDir = 'right';
        this.actionCounter = 0;
      } else if (this.actionCounter > 150 && this.sprite.moveDir == 'right'){
        this.sprite.moveDir = 'left';
        this.actionCounter = 0;
      }
      if (game.physics.arcade.distanceBetween(this.sprite, player) < 100) {
        this.sprite.status = 'attacking';
      }
      break;
    case 'attacking':
      if (this.sprite.body.x > player.body.x) {
        this.sprite.moveDir = 'left';
        this.sprite.body.velocity.x = -50;
        this.sprite.body.setSize(50, 55, 25, 15);
        if (game.physics.arcade.distanceBetween(this.sprite, player) < 50) {
          this.sprite.animations.play('fightleft');
        } else {
          this.sprite.animations.play('left');
        }
        if (this.sprite.body.blocked.left == true && this.sprite.body.onFloor() && game.time.now > jumpTimer)
        {
            this.sprite.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }
      } else {
        this.sprite.moveDir = 'right';
        this.sprite.body.velocity.x = 50;
        this.sprite.body.setSize(50, 55, 0, 15);
        if (game.physics.arcade.distanceBetween(this.sprite, player) < 50) {
          this.sprite.animations.play('fightright');
        } else {
          this.sprite.animations.play('right');
        }
        if (this.sprite.body.blocked.right == true && this.sprite.body.onFloor() && game.time.now > jumpTimer)
        {
            this.sprite.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }
      }
      break;
    case 'knockBack':
      knockedBackAnimation(player, this);
      break;
  }
  if (sword.alive == true) {
    game.physics.arcade.overlap(this.sprite, sword, attacking, null, this);
  }
  game.physics.arcade.overlap(this.sprite, player, damagePlayer, null, this);
}
