/**
 * Created by xastey on 4/3/2016.
 */

import {Rarity, GearType, GearStats, GearRarity} from '../../common/models/common';
import {Attributes, Attribute} from '../attributes/attributes.model';
import {Talent} from '../talents/talent.model';


export interface Gear {

  rarity: Rarity;
  type: GearType;
  name: string;

  score: number;
  stats: GearStats;
  armor: number;
  attributes: Attributes;
  mods: GearModSlot[];
  talent?: Talent;
}


export interface GearModSlot {
  id: number;
  primary?: Attribute;
  secondary?: Attribute;
}


export const DUMMY_GEAR: Gear = {
  rarity: 'gear-set',
  type: GearType.BodyArmor,
  name: "Sentry's Call harness",
  armor: 1049,
  score: 214,
  stats: {
    firearms: 0,
    stamina: 422,
    electronics: 0
  },
  attributes: {
    major: [{
      //'Health on Kill'
      id: 13,
      value: 8

    }],
    minor: [],
    skill: []

  },
  mods: [],
  talent: {}
};


export const GEAR_SCORES = (function () {
  let scores = {};
  scores[GearRarity.SUPERIOR] = [131, 147, 165];
  scores[GearRarity.HIGH_END] = [163, 182, 204];
  scores[GearRarity.GEAR_SET] = [191, 214, 240];
  return scores;
})();
