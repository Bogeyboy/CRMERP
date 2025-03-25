import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { WarehousesModule } from './warehouses/warehouses.module';
//import { SucursalDeliveriesComponent } from './sucursal-deliveries/sucursal-deliveries.component';
import { SucursalDeliveriesModule } from './sucursal-deliveries/sucursal-deliveries.module';


@NgModule({
  declarations: [
    //SucursalDeliveriesComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SucursalesModule,
    WarehousesModule,
    SucursalDeliveriesModule
  ]
})
export class ConfigurationModule { }
