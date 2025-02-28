import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SucursalesModule } from './sucursales/sucursales.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SucursalesModule
  ]
})
export class ConfigurationModule { }
