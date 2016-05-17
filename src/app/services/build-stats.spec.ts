/**
 * Created by Keyston on 5/9/2016.
 */
import {
  describe,
  it,
  expect,
  inject,
  beforeEach,
  injectAsync,
  beforeEachProviders


} from '@angular/core/testing';
import {HTTP_PROVIDERS, XHRBackend} from '@angular/http';

import {provide} from '@angular/core';

import {BuildStatsService, InventoryCalculator} from './build-stats.service';
import {ItemsService} from './item.service';
import {AttributesService} from './attributes.service';
import {Inventory} from '../components/inventory/inventory.model';
import {ItemType, GearRarity, Affects} from '../common/models/common';
import {FixtureBackend} from '../testing/fixture-backend';

describe('Build-statsService: service', () => {
  let service: BuildStatsService;

  let calculator: InventoryCalculator;

  let inventory = new Inventory();
  let gear = inventory.gear;
  gear.gloves = {
    rarity: GearRarity.HIGH_END,
    type: ItemType.Gloves,
    name: 'Hybrid gloves',
    armor: 500,
    score: 204,
    stats: {
      firearms: 0,
      stamina: 500,
      electronics: 0
    },
    attributes: {
      major: [],
      minor: [],
      skill: []
    },
    mods: [],
    talents: [{
      id: 'savage',
      value: 13
    }]
  };
  gear.bodyArmor = {
    rarity: GearRarity.HIGH_END,
    type: ItemType.BodyArmor,
    name: 'Hybrid armor',
    armor: 969,
    score: 204,
    stats: {
      firearms: 526,
      stamina: 0,
      electronics: 0
    },
    attributes: {
      major: [{

        id: 12, // Health
        value: 2700

      }, {
        id: 17,    // Skill Power
        value: 1400
      },
        {
          id: 1, // Crit Chance
          value: 10
        }],
      minor: [
        {
          id: 4, // Assault Rifle Damage
          value: 355
        }
      ],
      skill: []

    },
    mods: [
      {
        id: 1,
        primary: {
          id: 29, // Firearms
          value: 100
        },
        secondary: {
          id: 17, // Skill Power
          value: 1213

        }
      },
      {
        id: 1,
        primary: {
          id: 30, // Stamina
          value: 100
        },
        secondary: {
          id: 12,  // Health
          value: 650
        }
      },
      {
        id: 1,
        primary: {
          id: 31, // Electronics
          value: 100
        },
        secondary: {
          id: 17,  // Skill Power
          value: 1400
        }
      },
      {
        id: 1,
        primary: {
          id: 1, // Crit Chance
          value: 1.5
        }
      }
    ],
    talents: [
      {
        id: 'reckless',
        value: 13
      }

    ]
  };

  let weapons = inventory.weapons;
  weapons.primary = {
    rarity: GearRarity.HIGH_END,
    type: ItemType.AR,
    name: 'Black Market AK-74',
    score: 204,

    stats: {
      damage: 13500,
      rpm: 600,
      magazine: 30
    },
    mods: [
      {
        id: 8, // HE - Mag
        itemId: 1, // Extended Magazine
        primary: {
          id: 12,  // +MagSize
          value: 100 // percent
        },
        secondary: {
          id: 3, // Weapon Damage
          value: 13 // percent
        }
      },
      {
        id: 5, // HE Muzzle
        itemId: 2,
        primary: {
          id: 8, // Horizontal Stability,
          value: 10
        },
        secondary: {
          id: 1, // Crit Chance
          value: 5
        }
      }
    ],
    talents: [
      {
        id: 'brutal'
      },
      {
        id: 'deadly',
        value: 23
      },
      {
        id: 'fierce',
        value: 10
      }
    ]
  };
// setup
  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    provide(XHRBackend, {useClass: FixtureBackend}),
    BuildStatsService,
    ItemsService,
    AttributesService
  ]);

  let calc: InventoryCalculator;
  beforeEach(inject([BuildStatsService, ItemsService],
    (_service: BuildStatsService, itemsService: ItemsService) => {
      service = _service;
      calc = service.create(inventory);
    }));

  /*it('should create InventoryCalculator', inject([ItemsService], () => {


   spyOn(itemsService, '_gearDescriptors');
   spyOn(itemsService, '_weaponDescriptors');

   let calc = service.create(inventory);
   expect(itemsService._gearDescriptors).toHaveBeenCalled();
   expect(itemsService._weaponDescriptors).toHaveBeenCalled();
   }));*/

  it('should calculate electronics', () => {

    expect(calc.electronics).toEqual(635);
  });

  it('should calculate skillpower', () => {


    expect(calc.skillpower).toEqual(10363);
  });

  it('should calculate firearms', () => {

    expect(calc.firearms).toEqual(626);
  });

  it('should calculate stamina', () => {

    expect(calc.stamina).toEqual(600);
  });

  it('should calculate health', () => {

    expect(calc.health).toEqual(21350);
  });
  it('should calculate weaponDamage', () => {

    expect(calc.weaponDamage(ItemType.AR)).toEqual(355);
  });

  it('should calculate affects value from talents', () => {
    let value = calc.calculateAffectsValueFromTalents(Affects.WEAPON_DAMAGE);
    expect(value).toEqual(13);
  });

  it('should calculate affects value from attributes', () => {
    let value = calc.calculateAffectsValueFromAttributes(Affects.CRIT_HIT_CHANCE);
    expect(value).toEqual(10);
  });

  it('should calculate affects', () => {

    let value = calc.calculateTotalAffectsValue(Affects.CRIT_HIT_CHANCE);
    expect(value).toEqual(24.5);
  });


});
