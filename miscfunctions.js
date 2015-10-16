function attacking() {
	if (sword.alive == true && sword.hitThisRound == false) {
		if (this.health > 0) {
			this.health -= sword.damage;
			sword.alive = false;
			sword.hitThisRound = true;
			this.batStatus = 'knockBack';
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

	// Initialize knock back
	var distance = 75;
	var knockedDirection = facing; // I don't really like how this is used.  I can probably get rid of it.

	if(attacked.knockedTo == 0)
	{
		immortal				= true;


		switch(knockedDirection)
		{
			case 'left':
				attacked.knockedTo		= (attacked.sprite.body.x - distance);
			break;
			case 'right':
				attacked.knockedTo		= (attacked.sprite.body.x + distance);
			break;
		}

	}

	switch(knockedDirection)
	{
		case 'left':
			knockedVelocityX= -500;

			// Parabolic knock back arc
			attacked.sprite.body.velocity.x = knockedVelocityX;

			if(attacked.sprite.body.x <= (attacked.knockedTo + distance/2))
			{
				attacked.sprite.body.velocity.y = 100;
			}
			else
			{
				attacked.sprite.body.velocity.y = -100;
			}

			// Player has been knocked back as far as he needs to, reset
			if(attacked.sprite.body.x <= attacked.knockedTo || attacked.sprite.body.x <= 0)
			{
				attacked.knockedTo 		= 0;
				knockback 		= false;
				attacked.batStatus = 'attacking';
			}

		break;

		case 'right':
			knockedVelocityX= 500;

			// Parabolic knock back arc - A major pain in my ass
			attacked.sprite.body.velocity.x = knockedVelocityX;

			if(attacked.sprite.body.x >= (attacked.knockedTo + distance/2))
			{
				attacked.sprite.body.velocity.y = 100;
			}
			else
			{
				attacked.sprite.body.velocity.y = -100;
			}

			// Player has been knocked back as far as he needs to, reset
			if(attacked.sprite.body.x >= attacked.knockedTo || attacked.sprite.body.x >= game.canvas.width + 30)
			{
				attacked.knockedTo 		= 0;
				knockback 		= false;
				attacked.batStatus = 'attacking';
			}

		break;
	}

	// A ghostly visage for a short stint of immortality
	// attacked.sprite.body.sprite.alpha = 0.5;

}

function enableHitbox(hitboxName) {
    for(var i = 0; i < hitboxes.children.length; i++){
          if(hitboxes.children[i].name === hitboxName){
						if(facing == 'right') {
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
	// TODO: Make a player damage function.
	// too tired to code right now.
}
