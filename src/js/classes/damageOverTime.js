// Damage over time auras
class DamageOverTime {
	constructor(player) {
		this.player = player;
		this.durationTotal = 0;
		this.tickTimerTotal = 3;
		this.tickTimerRemaining = 0;
		this.ticksRemaining = 0;
		this.snapshots = true;
		this.dmg = 0;
		this.spellPower = 0;
		this.modifier = 1;
		this.active = false;
		this.school = null;
		this.name = null;
		this.coefficient = 0;
	}

	setup() {
		this.ticksTotal = this.durationTotal / this.tickTimerTotal;
		this.originalDurationTotal = this.durationTotal;
		this.varName = camelCase(this.name);
		this.player.damageBreakdown[this.varName] = this.player.damageBreakdown[this.varName] || {"name": this.name};
	}

	apply(spellPower) {
		this.active = true;
		this.tickTimerRemaining = this.tickTimerTotal;
		this.ticksRemaining = this.ticksTotal;
		this.spellPower = spellPower;
	}

	fade() {
		this.active = false;
		this.tickTimerRemaining = 0;
		this.ticksRemaining = 0;
	}

	tick(t) {
		if (this.active) {
			this.tickTimerRemaining = Math.max(0,this.tickTimerRemaining - t);

			if (this.tickTimerRemaining == 0) {
				let sp = 0;
				if (this.snapshots) {
					sp = this.spellPower;
				} else {
					sp = this.player.stats.spellPower + this.player.stats[this.school + "Power"];
				}

				let dmg = ((this.dmg + sp * this.coefficient) * this.modifier * this.player.stats[this.school + "Modifier"]) / (this.originalDurationTotal / this.tickTimerTotal);
				// Add bonus from ISB (without removing ISB stacks since it's a dot)
				if (this.school == "shadow" && this.player.auras.improvedShadowBolt && this.player.auras.improvedShadowBolt.active) {
					dmg *= this.player.auras.improvedShadowBolt.modifier;
				}

				// Check for Nightfall proc
				if (this.varName == "corruption" && this.player.talents.nightfall > 0) {
					if (random(1,100) <= this.player.talents.nightfall * 2) {
						this.player.auras.shadowTrance.apply();
					}
				}

				this.player.damageBreakdown[this.varName].damage = this.player.damageBreakdown[this.varName].damage + dmg || dmg;
				this.player.iterationDamage += dmg;
				this.player.combatLog(this.name + " " + Math.round(dmg));
				this.ticksRemaining--;
				this.tickTimerRemaining = this.tickTimerTotal;

				if (this.ticksRemaining <= 0) {
					this.active = false;
				}
			}
		}
	}
}

class CorruptionDot extends DamageOverTime {
	constructor(player) {
		super(player);
		this.durationTotal = 18;
		this.tickTimerTotal = 3;
		this.dmg = 1035;
		this.modifier = 1 + (0.01 * this.player.talents.contagion);
		this.school = "shadow";
		this.name = "Corruption";
		this.coefficient = 0.936 + (0.12 * player.talents.empoweredCorruption);
		this.minimumDuration = 9;
		this.boosted = false; // Track whether the corruption's dmg has been boosted by T5 4pc or not
		this.setup();

		if (player.sets['529'] >= 4) this.modifier *= 1.12;		// T3 4pc
		if (player.sets['645'] >= 4) this.durationTotal += 3;	// T4 4pc
		if (player.sets['646'] >= 4)
		this.ticksTotal = this.durationTotal / this.tickTimerTotal;
	}

	apply(spellPower) {
		// T5 4pc
		if (this.boosted) {
			this.modifier /= 1.1;
			this.boosted = false;
		}
		super.apply(spellPower);
	}
}

class UnstableAfflictionDot extends DamageOverTime {
	constructor(player) {
		super(player);
		this.durationTotal = 18;
		this.tickTimerTotal = 3;
		this.dmg = 1155;
		this.school = "shadow";
		this.name = "Unstable Affliction";
		this.coefficient = 1.2;
		this.minimumDuration = 9;
		this.setup();
	}
}

class SiphonLifeDot extends DamageOverTime {
	constructor(player) {
		super(player);
		this.durationTotal = 30;
		this.tickTimerTotal = 3;
		this.dmg = 695;
		this.school = "shadow";
		this.name = "Siphon Life";
		this.coefficient = 1;
		this.minimumDuration = 30;
		this.setup();
	}
}

class ImmolateDot extends DamageOverTime {
	constructor(player) {
		super(player);
		this.durationTotal = 15;
		this.tickTimerTotal = 3;
		this.dmg = 615;
		this.school = "fire";
		this.name = "Immolate";
		this.coefficient = 0.65;
		this.minimumDuration = 12;
		this.boosted = false; // Track whether the Immolate's dmg has been boosted by T5 4pc or not
		this.setup();

		if (player.sets['645'] >= 4) this.durationTotal += 3;	// T4 4pc
		this.ticksTotal = this.durationTotal / this.tickTimerTotal;
	}

	apply(spellPower) {
		if (this.boosted) {
			this.modifier /= 1.1;
			this.boosted = false;
		}
		super.apply(spellPower);
	}
}

class CurseOfAgonyDot extends DamageOverTime {
	constructor(player) {
		super(player);
		this.durationTotal = 24;
		this.tickTimerTotal = 3;
		this.dmg = 1698 * (1 + 0.05 * player.talents.improvedCurseOfAgony);
		this.modifier = 1 + (0.01 * player.talents.contagion);
		this.school = "shadow";
		this.name = "Curse of Agony";
		this.coefficient = 1.2;
		this.minimumDuration = 15;
		this.setup();
	}
}