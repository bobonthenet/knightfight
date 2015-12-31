function Bat (color, health, xpos, ypos) {
	this.color = color;
	this.health = health;
	// this.xpos = xpos;
	// this.ypos = ypos;
  this.sprite = game.add.sprite(xpos, ypos, this.color + 'bat');
	this.sprite.animations.add('batfly', [0, 1, 2, 3], 10, true);
	this.sprite.animations.play('batfly');
	this.sprite.status = 'new'; //This var name should be something more generic.
	this.batActions = batActions;
	this.actionCounter = 0;
	this.sprite.moveDir = 'left';
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.allowGravity = false;
	this.sprite.knockedTo = 0;
	this.hitThisRound = false; // The bat should only be able to hit the player once per second.

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

function batActions() {
	if (game.physics.arcade.distanceBetween(this.sprite, player) > 100 && this.sprite.status == 'new') { //Make this into a switch statement.

		if(this.sprite.moveDir == 'left'){
			this.sprite.x -= 4
		} else {
			this.sprite.x += 4
		}
		var movRand = Math.floor((Math.random() * 5) + 1);
		this.actionCounter += movRand;
		if (this.actionCounter > 100 && this.sprite.moveDir == 'left')
		{
			this.sprite.moveDir = 'right';
			this.actionCounter = 0;
			// TODO: This volume logic is techically broken because it uses a generic sound instead of one belonging to a bat.
			if (Math.floor(game.physics.arcade.distanceBetween(this.sprite, player)) > 1000)
			{
				batSqueek.volume = 0;
			}else{
				batSqueek.volume = 1 - Math.floor(game.physics.arcade.distanceBetween(this.sprite, player)) *.001;
			}
			batSqueek.play();
		} else if (this.actionCounter > 100 && this.sprite.moveDir == 'right'){
			this.sprite.moveDir = 'left';
			this.actionCounter = 0;
			if (Math.floor(game.physics.arcade.distanceBetween(this.sprite, player)) > 1000)
			{
				batSqueek.volume = 0;
			}else{
				batSqueek.volume = 1 - Math.floor(game.physics.arcade.distanceBetween(this.sprite, player)) *.001;
			}
			batSqueek.play();
		}

	} else if (this.sprite.status == 'new' || this.sprite.status == 'attacking') {
		if (this.sprite.status == 'new') {
			this.sprite.status = 'attacking'
		}
		game.physics.arcade.moveToObject(this.sprite, player, 100);
		if (this.sprite.body.x > player.body.x) {
			this.sprite.moveDir = 'left';
		} else {
			this.sprite.moveDir = 'right';
		}
	} else if (this.sprite.status == 'knockBack') {
		knockedBackAnimation(player, this)
		batPain.play();
	}
	if (sword.alive == true) {
		game.physics.arcade.overlap(this.sprite, sword, attacking, null, this);
	}

	game.physics.arcade.overlap(this.sprite, player, damagePlayer, null, this);
}
