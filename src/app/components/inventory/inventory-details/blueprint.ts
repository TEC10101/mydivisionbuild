import {Affects} from '../../../common/models/affects';
/**
 * Created by Keyston on 5/20/2016.
 */

export const BLUEPRINT = [
  {
    title: 'Offense',
    affects: [
      Affects.CRIT_HIT_CHANCE,
      Affects.CRIT_HIT_DAMAGE,
      Affects.HEADSHOT_DAMAGE
    ]
  },
  {
    title: 'Enemy-specfic damage increases',
    affects: [
      Affects.DAMAGE_TO_ELITES,
      Affects.ENEMY_ARMOR_DAMAGE
    ]
  },
  {
    title: 'Weapon-specific damage increases',
    affects: [
      Affects.ASSAULT_RIFLE_DAMAGE,
      Affects.LMG_DAMAGE,
      Affects.MARKSMAN_RIFLE_DAMAGE,
      Affects.PISTOL_DAMAGE,
      Affects.SHOTGUN_DAMAGE,
      Affects.SMG_DAMAGE
    ]
  },
  {
    title: 'Defense',
    affects: [
      Affects.HEALTH,
      Affects.STAMINA,
      Affects.ARMOR,
      Affects.MITIGATION,
      Affects.PROTECTION_FROM_ELITES,
      Affects.HP_ON_KILL
    ]
  },
  {
    title: 'Resistances',
    affects: [
      Affects.BLEED_RESISTANCE,
      Affects.BLIND_AND_DEAF_RESISTANCE,
      Affects.BURN_RESISTANCE,
      Affects.DISORIENT_RESISTANCE,
      Affects.DISRUPT_RESISTANCE,
      Affects.EXOTIC_DAMAGE_RESILIENCE,
      Affects.SHOCK_RESISTANCE
    ]
  },
  {
    title: 'Support',
    affects: [
      Affects.SKILL_POWER,
      Affects.ELECTRONICS,
      Affects.SKILL_HASTE,
      Affects.SIGNATURE_RESOURCE_GAIN,
      Affects.AMMO_CAPACITY,
      Affects.SCAVENGING
    ]
  }
];
