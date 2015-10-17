function attacking() {
	if (sword.alive == true && sword.hitThisRound == false) {
		if (this.health > 0) {
			this.health -= sword.damage;
			sword.alive = false;
			sword.hitThisRound = true;
			this.sprite.batStatus = 'knockBack';
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
				attacked.batStatus = 'attacking';
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
				attacked.batStatus = 'attacking';
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
							// hitboxes.children[i].hitThisRound = true;
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
	knockedBackAnimation(this, player);
}
