function attacking() {
	if (sword.alive == true && sword.hitThisRound == false) {
		if (this.health > 0) {
			this.health -= sword.damage;
			sword.alive = false;
			sword.hitThisRound = true;
			this.sprite.status = 'knockBack';
		// grab a damage text from the pool to display what happened
		var dmgText = this.dmgTextPool.getFirstExists(false);
		if (dmgText) {
		  dmgText.text = sword.damage;
		  dmgText.reset(this.sprite.x, this.sprite.y);
		  dmgText.alpha = 1;
		  dmgText.tween.start();
		}


		} else {
			this.sprite.kill();
			if(this.deathsound)
			{
				this.deathsound.play();
				if (this.sprite.status =='spellCasting')
				{
					playerWins();
				}
			}
		}
	}
}

// Shows the player sprite being knocked away from the enemy after taking a hit (being touched)
function knockedBackAnimation(attacker, attacked) {
	// attacked.sprite.animations.stop();
	attacker = attacker.sprite != undefined ? attacker.sprite : attacker;
	attacked = attacked.sprite != undefined ? attacked.sprite : attacked;
	// Initialize knock back
	var distance = 75;
	var knockedDirection = attacker.moveDir; // I don't really like how this is used.  I can probably get rid of it.

	if(attacked.knockedTo == 0)
	{
		immortal				= true;


		switch(knockedDirection)
		{
			case 'left':
				attacked.knockedTo		= (attacked.body.x - distance);
			break;
			case 'right':
				attacked.knockedTo		= (attacked.body.x + distance);
			break;
		}

	}

	switch(knockedDirection)
	{
		case 'left':
			knockedVelocityX= -500;

			// Parabolic knock back arc
			attacked.body.velocity.x = knockedVelocityX;

			if(attacked.body.x <= (attacked.knockedTo + distance/2))
			{
				attacked.body.velocity.y = 100;
			}
			else
			{
				attacked.body.velocity.y = -100;
			}

			// Player has been knocked back as far as he needs to, reset
			if(attacked.body.x <= attacked.knockedTo || attacked.body.x <= 0)
			{
				attacked.knockedTo 		= 0;
				knockback 		= false;
				attacked.status = 'attacking';
			}

		break;

		case 'right':
			knockedVelocityX= 500;

			// Parabolic knock back arc - A major pain in my ass
			attacked.body.velocity.x = knockedVelocityX;

			if(attacked.body.x >= (attacked.knockedTo + distance/2))
			{
				attacked.body.velocity.y = 100;
			}
			else
			{
				attacked.body.velocity.y = -100;
			}

			// Player has been knocked back as far as he needs to, reset
			if(attacked.body.x >= attacked.knockedTo || attacked.body.x >= game.canvas.width + 30)
			{
				attacked.knockedTo 		= 0;
				knockback 		= false;
				attacked.status = 'attacking';
			}

		break;
	}

	// A ghostly visage for a short stint of immortality
	// attacked.body.sprite.alpha = 0.5;

}

function enableHitbox(hitboxName) {
    for(var i = 0; i < hitboxes.children.length; i++){
          if(hitboxes.children[i].name === hitboxName){
						if(player.moveDir == 'right') {
							hitboxes.children[i].reset(player.x - 35, player.y);
						} else {
							hitboxes.children[i].reset(player.x - 75, player.y);
						}

						if (hitboxes.children[i].hitThisRound == false) {
							hitboxes.children[i].alive = true;
							game.time.events.add(Phaser.Timer.SECOND * .25, disableAllHitboxes, this);
						}
          }
  	}
}

function disableAllHitboxes() {
     hitboxes.forEachExists(function(hitbox) {
          hitbox.kill();
					hitbox.hitThisRound = false;
     });
}

function damagePlayer() {
	player.status = 'knockedBack'
	player.whoHitMe = this;
	if (this.hitThisRound == false) {
		player.health -= 1;
		this.hitThisRound = true;
		live = lives.getFirstAlive();

		if (live)
		{
				live.kill();
		}
		game.time.events.add(Phaser.Timer.SECOND, function(){this.hitThisRound = false;}, this);
	}; // not sure about this.  Maybe the timer should be on the player instead of the bat.
		 // currently "this" bat can only hit the player once per second but all the bats have their
		 // own timer.  So if the player gets swarmed, he is fucked.  Makes sense but might be too
		 // hard.  I'll do a survey or something.

	if (player.health <= 0) {
		playerDeath();
	}

}

function playerDeath() {
	var gameOverText = game.add.text(game.camera.x + 100, game.camera.y + 150, 'You were defeated!');
	gameOverText.font = 'Press Start 2P';
	gameOverText.fontSize = 32;
	player.kill();
	game.time.events.add(Phaser.Timer.SECOND * 3, function(){location.reload()}, this);
}

function playerWins() {
	var gameOverText = game.add.text(game.camera.x + 100, game.camera.y + 150, 'You defeated the evil wizard! You win!');
	gameOverText.wordWrap = true;
	// gameOverText.anchor.set(0.5);
	gameOverText.wordWrapWidth = 400
	gameOverText.font = 'Press Start 2P';
	gameOverText.fontSize = 32;
	player.kill();
	game.time.events.add(Phaser.Timer.SECOND * 5, function(){location.reload()}, this);
}

function fireBullet (enemy) {

		enemy.justAttacked = true;

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);
				enemy.sprite.animations.play('fightleft', 5, false);
				magic.play();
        if (bullet)
        {
            bullet.reset(enemy.sprite.x, enemy.sprite.y + player.height * .5);
            bullet.body.velocity.x = -300;
						bullet.animations.play('left', 10, true);
            bulletTime = game.time.now + 150;
        }
    }

		game.time.events.add(Phaser.Timer.SECOND * 3, function(){enemy.justAttacked = false;}, this);
}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

}
