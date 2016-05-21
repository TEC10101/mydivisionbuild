/**
 * Created by Keyston on 5/20/2016.
 */

const LABEL_KEEP = {

  from: true,
  and: true

};
export type Affects = 'crit_hit_chance' | 'crit_hit_damage' | 'weapon_damage'
  | 'assault_rifle_damage' | 'shotgun_damage' | 'smg_damage'| 'lmg_damage'
  |'pistol_damage'|'marksman_rifle_damage'|'armor'|'health'|'skill_power'
  |'protection_from_elites'|'hp_on_kill'
  |'firearms'|'stamina'|'electronics' | 'accuracy' | 'hip_accuracy' | 'magazine_size'
  |'headshot_damage' |'rpm' | 'reload'|
  'bleed_resistance'|'blind_and_deaf_resistance'|'burn_resistance'
  |'disorient_resistance'|'disrupt_resistance'|'exotic_damage_resilience'|'shock_resistance'
  |'skill_haste'|'signature_skill_resource_gain' | 'ammo_capacity' | 'scavenging' | 'mitigation';
// tslint:disable-next-line
export const Affects = {

  normalize: function (value: string) {
    return (value.replace(/-/g, '_').toLowerCase()) as Affects;
  },
  toLabel: function (affects: Affects) {

    return _.map((<string>affects).replace(/_/g, ' ').split(' '), (str) => {
      return LABEL_KEEP[str] ? str :
      str.charAt(0).toUpperCase() + str.slice(1);
    }).join(' ');
  },
  // Offense
  CRIT_HIT_CHANCE: 'crit_hit_chance'  as Affects,
  CRIT_HIT_DAMAGE: 'crit_hit_damage'  as Affects,
  HEADSHOT_DAMAGE: 'headshot_damage' as Affects,
  WEAPON_DAMAGE: 'weapon_damage'  as Affects,
  // Enemy specfic damange increases
  DAMAGE_TO_ELITES: 'damage_to_elites' as Affects,
  ENEMY_ARMOR_DAMAGE: 'enemy_armor_damage' as Affects,
  // Weapon - specific damange increases
  ASSAULT_RIFLE_DAMAGE: 'assault_rifle_damage'  as Affects,
  LMG_DAMAGE: 'lmg_damage'  as Affects,
  MARKSMAN_RIFLE_DAMAGE: 'marksman_rifle_damage' as Affects,
  PISTOL_DAMAGE: 'pistol_damage' as Affects,
  SHOTGUN_DAMAGE: 'shotgun_damage'  as Affects,
  SMG_DAMAGE: 'smg_damage' as Affects,
  // Defense
  HEALTH: 'health' as Affects,
  ARMOR: 'armor' as Affects,
  PROTECTION_FROM_ELITES: 'protection_from_elites' as Affects,
  HP_ON_KILL: 'hp_on_kill' as Affects,
  // Resistances
  BLEED_RESISTANCE: 'bleed_resistance' as Affects,
  BLIND_AND_DEAF_RESISTANCE: 'blind_and_deaf_resistance' as Affects,
  BURN_RESISTANCE: 'burn_resistance' as Affects,
  DISORIENT_RESISTANCE: 'disorient_resistance' as Affects,
  DISRUPT_RESISTANCE: 'disrupt_resistance' as Affects,
  EXOTIC_DAMAGE_RESILIENCE: 'exotic_damage_resilience' as Affects,
  SHOCK_RESISTANCE: 'shock_resistance' as Affects,

  // Support
  SKILL_POWER: 'skill_power'  as Affects,
  SKILL_HASTE: 'skill_haste' as Affects,
  SIGNATURE_RESOURCE_GAIN: 'signature_skill_resource_gain' as Affects,
  AMMO_CAPACITY: 'ammo_capacity' as Affects,
  SCAVENGING: 'scavenging' as Affects,
  // OTHERS
  FIREARMS: 'firearms' as Affects,
  STAMINA: 'stamina' as Affects,
  ELECTRONICS: 'electronics' as Affects,
  ACCURACY: 'accuracy' as Affects,
  HIP_ACCURACY: 'hip_accuracy' as Affects,
  MAGAZINE_SIZE: 'magazine_size' as Affects,
  MITIGATION: 'mitigation' as Affects,


  RELOAD: 'reload' as Affects,
  RPM: 'rpm' as Affects


};

export interface AffectsResults {

  affects: Affects;
  value: number;
}

