/**
 * Created by xastey on 5/9/2016.
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
import {HTTP_PROVIDERS} from '@angular/http';


import {BuildStatsService, InventoryCalculator} from './build-stats.service';
import {ItemsService} from './item.service';
import {AttributesService} from './attributes.service';
import {Inventory} from '../components/inventory/inventory.model';
import {ItemType, GearRarity} from '../common/models/common';
describe('Build-statsService: service', () => {
  let service;

  let calculator: InventoryCalculator;

  let inventory = new Inventory();
  let gear = inventory.gear;
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
        value: 2633

      }],
      minor: [],
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
          value: 645
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

// setup
  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    BuildStatsService,
    ItemsService,
    AttributesService
  ]);

  beforeEach(inject([BuildStatsService], _service => {
    service = _service;
  }));

  it('should render Build-stats', done => {

    done();
  });


});
