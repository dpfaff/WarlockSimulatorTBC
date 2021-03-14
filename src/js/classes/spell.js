class Spell {
	constructor(player) {
		this.castTime = 0;
		this.manaCost = 0;
		this.cooldown = 0;
		this.cooldownRemaining = 0;
		this.player = player;
		this.casting = false;
	}

	ready() {
		return this.player.gcdRemaining <= 0 && this.player.castTimeRemaining <= 0 && this.manaCost <= this.player.mana && this.cooldownRemaining <= 0;
	}

	cast() {
		this.player.gcdRemaining = this.player.gcdValue;

		if (this.castTime > 0) {
			this.player.castTimeRemaining = this.castTime;
			this.casting = true
		}
	}

	damage() {
		return 0;
	}

	tick(t) {
		if (this.player.castTimeRemaining > 0) this.player.castTimeRemaining -= t;

		if (this.player.castTimeRemaining <= 0 && this.casting) {
			this.player.mana -= this.manaCost;
			this.cooldownRemaining = this.cooldown;
			//this.player.mp5Timer = 5;
			this.casting = false;
			
			return this.damage();
		}
		return 0;
	}
}

class ShadowBolt extends Spell {
	constructor(player) {
		super(player);
		this.name = "Shadow Bolt";
		this.manaCost = 420 * (1 - (player.talents.cataclysm / 100));
		this.castTime = 3 - (player.talents.bane / 10);
		this.coefficient = 3 / 3.5;
		this.dmg = 633; // Average rank 11 Shadow Bolt base damage
	}

	damage() {
		if (!this.player.isHit(false)) {
			return 0;
		}

		let dmg = (this.dmg + ((this.player.stats.spellPower + this.player.stats.shadowPower) * this.coefficient)) * this.player.stats.shadowModifier;

		let isCrit = this.player.isCrit();
		if (isCrit) {
			dmg *= (1.5 + 0.5 * this.player.talents.ruin);

			// Add ISB debuff
		}

		dmg = ~~(dmg *  (1 - 0.0025 * this.player.enemy.shadowResist));

		return dmg;
	}
}

class LifeTap extends Spell {
	constructor(player) {
		super(player);
		this.name = "Life Tap";
		this.manaReturn = 582;
		this.coefficient = 0.8;
	}

	cast() {
		super.cast();
		this.player.mana = Math.min(this.player.stats.maxMana, this.player.mana + (this.manaReturn + ((this.player.stats.spellPower + this.player.stats.shadowPower) * this.coefficient)));
	}
}