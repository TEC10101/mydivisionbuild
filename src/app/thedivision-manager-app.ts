/**
 * Created by xastey on 4/2/2016.
 */

import {Component, ViewEncapsulation} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Gear, GearOverviewComponent} from "./components/gear-overview/gear-overview.component";
import {OnInit} from 'angular2/core';
import {AttributeFormat} from "./components/attributes/attributes.model";
import {DIVISION_PROVIDERS} from "./services/core";
import {GearType} from "./common/models/common";


@Component({
  selector: 'the-division-manager-app',

  pipes: [],
  styles: [require("./assets/styles/app.scss")],
  directives: [ROUTER_DIRECTIVES, GearOverviewComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app/the-division-manager-app.html',
  providers: [DIVISION_PROVIDERS]
})

export class TheDivisionManagerApp implements OnInit {

  gear:Gear;

  constructor() {
  }

  ngOnInit() {
    this.gear = {
      rarity: "superior",
      type: GearType.BodyArmor,
      title: "Rapid Assault Vest",
      armor: 1049,
      level: 30,
      stats: {
        firearms: 0,
        stamina: 422,
        electronics: 0
      },
      attributes: {
        major: [{
          title: "Health on Kill",
          value: 8,
          format: AttributeFormat.PERCENT
        }],
        minor: [],
        skill: []

      },
      modslots: []
    }
  }


}
