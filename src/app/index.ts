import {DIVISION_PROVIDERS} from './services/core';
import {InventoryComponent} from './components/inventory/inventory.component';
import {ItemOverviewComponent} from './components/item-overview/item-overview.component.ts';
export * from './app.component';


export const APP_DIRECTIVES = [
  InventoryComponent, ItemOverviewComponent
];
export const APP_PROVIDERS = [
  ...DIVISION_PROVIDERS
];
