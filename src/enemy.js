import { EnemyConfig } from "./config.js";
import { getArtifactEffectBonus } from "./artifact.js";

export class EnemyHero {
  constructor(level) {
    this.level = level;

    // Determine bonus multiplier based on level bracket
    const bonusMultiplier = Math.ceil(level / 10);

    // Max HP calculation with bonus scaling
    this.maxHp = Math.floor(
      EnemyConfig.baseHp * Math.pow(EnemyConfig.hpGrowth, level - 1) +
        EnemyConfig.baseHp * bonusMultiplier * level
    );

    // Set current HP
    this.currentHp = this.maxHp;

    // Damage calculation with bonus scaling
    this.dmg = Math.floor(
      EnemyConfig.baseDmg * Math.pow(EnemyConfig.dmgGrowth, level - 1) +
        EnemyConfig.baseDmg * bonusMultiplier * level
    );
  }

  isAlive() {
    return this.currentHp > 0;
  }

  takeDamage(amount) {
    this.currentHp = Math.max(0, this.currentHp - amount);
  }

  getCurrentHp() {
    return this.currentHp;
  }

  getMaxHp() {
    return this.maxHp;
  }

  getDmg() {
    return this.dmg;
  }

  getLevel() {
    return this.level;
  }
}
