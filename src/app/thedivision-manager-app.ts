/**
 * Created by xastey on 4/2/2016.
 */

import {Component, ViewEncapsulation, OnInit} from "angular2/core";
import {ROUTER_DIRECTIVES} from "angular2/router";
import {Gear, GearOverviewComponent} from "./components/gear-overview/gear-overview.component";
import {DIVISION_PROVIDERS} from "./services/core";
import {GearType} from "./common/models/common";
import {EditorService} from "./services/editor-service";


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

  constructor(private _editorService:EditorService) {
  }

  ngOnInit() {
    this.gear = {
      rarity: "superior",
      type: GearType.BodyArmor,
      itemId: 16,
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
          id: 13,//"Health on Kill",
          value: 8

        }],
        minor: [],
        skill: []

      },
      modslots: []
    }
  }

  get currentEditorState() {
    return this._editorService.state ? 'Currently On' : 'Currently Off';
  }

  onToggleEditor() {
    this._editorService.toggle();
  }


}
