import {DIVISION_PROVIDERS} from "./services/core";
import {InventoryComponent} from "./components/inventory/inventory.component";
import {GearOverviewComponent} from "./components/gear-overview/gear-overview.component";
export * from './app.component';


export const APP_DIRECTIVES = [
  InventoryComponent, GearOverviewComponent
];
export const APP_PROVIDERS = [
  ...DIVISION_PROVIDERS
];
