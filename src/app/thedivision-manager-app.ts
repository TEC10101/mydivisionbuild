/**
 * Created by xastey on 4/2/2016.
 */

import {Component, ViewEncapsulation} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Gear, GearOverview} from "./components/gear-overview/gear-overview";

@Component({
  selector: 'the-division-manager-app',
  providers: [],
  pipes: [],
  styles: [require("./assets/styles/app.scss")],
  directives: [ROUTER_DIRECTIVES, GearOverview],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app/the-division-manager-app.html',
})

export class TheDivisionManagerApp {

  gear:Gear;

  constructor() {
  }

  ngOnInit() {
    this.gear = {
      rarity: "superior",
      title: "Responder Pads",
      level: 30,
      stats: {
        firearms: 0,
        stamina: 366,
        electronics: 0
      }
    }
  }


}
