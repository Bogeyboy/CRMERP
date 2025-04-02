import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { WarehousesModule } from './warehouses/warehouses.module';
//import { SucursalDeliveriesComponent } from './sucursal-deliveries/sucursal-deliveries.component';
import { SucursalDeliveriesModule } from './sucursal-deliveries/sucursal-deliveries.module';
import { MethodPaymentModule } from './method-payment/method-payment.module';


@NgModule({
  declarations: [
    //SucursalDeliveriesComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SucursalesModule,
    WarehousesModule,
    SucursalDeliveriesModule,
    MethodPaymentModule
  ]
})
export class ConfigurationModule { }
