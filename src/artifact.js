import { ArtifactConfig } from "./config.js";
import { spendHeroSouls } from "./resources.js";
import { ACHIEVEMENTS } from "./achievements.js";
import { resources } from "./resources.js";

export const artifactStates = {};
for (const key in ArtifactConfig) {
  artifactStates[key] = 0;
}

export function getHeroSoulMultiplier(enemyLevel = 1) {
  const boosterTier = artifactStates["HeroSoulBooster"] || 0;
  const baseSouls = Math.floor(enemyLevel / 50) + 1;
  return baseSouls + boosterTier * 0.1;
}

export function getArtifactTier(artifactKey) {
  return artifactStates[artifactKey];
}

export function getArtifactUpgradeCost(artifactKey) {
  const cfg = ArtifactConfig[artifactKey];
  const currentTier = artifactStates[artifactKey];
  if (cfg.maxTier !== undefined && currentTier >= cfg.maxTier) {
    return Infinity;
  }
  const rawCost = cfg.baseCost * Math.pow(cfg.costGrowth, currentTier);
  return Math.floor(rawCost);
}

export function upgradeArtifact(artifactKey) {
  const cfg = ArtifactConfig[artifactKey];
  const currentTier = artifactStates[artifactKey];
  if (cfg.maxTier !== undefined && currentTier >= cfg.maxTier) {
    return false;
  }
  const cost = getArtifactUpgradeCost(artifactKey);
  if (!isFinite(cost)) {
    return false;
  }
  if (!spendHeroSouls(cost)) {
    return false;
  }
  artifactStates[artifactKey] += 1;
  return true;
}

export function getAllArtifactKeys() {
  return Object.keys(ArtifactConfig);
}

export function getArtifactEffectBonus(effectType, unitType = null) {
  let total = 0;
  for (const key in ArtifactConfig) {
    const cfg = ArtifactConfig[key];
    const tier = artifactStates[key];
    if (tier <= 0) continue;
    if (cfg.effect !== effectType) continue;
    if (cfg.appliesTo && cfg.appliesTo !== unitType) continue;
    total += tier * cfg.effectValue;
  }
  return total;
}

export function getAchievementGoldPerSecond() {
  let unlocked = 0;
  for (const ach of ACHIEVEMENTS) {
    let progress = 0;
    if (ach.type === "gold") progress = resources.lifetimeGold;
    else if (ach.type === "soul") progress = resources.lifetimeSouls;
    else if (ach.type.startsWith("summon_"))
      progress = resources.lifetimeSummoned[ach.type.split("_")[1]] || 0;
    else if (ach.type === "slain") progress = resources.lifetimeEnemiesSlain;
    else if (ach.type === "herolevel")
      progress = resources.highestEnemyLevel || 1;
    else if (ach.type === "prestige") progress = resources.prestigeCount || 0;
    if (progress >= ach.value) unlocked++;
  }
  return unlocked;
}
