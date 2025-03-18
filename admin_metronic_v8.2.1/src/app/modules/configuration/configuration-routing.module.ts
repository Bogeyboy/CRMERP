import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sucursales',
    loadChildren: ()=> import('./sucursales/sucursales.module').then((m) => m.SucursalesModule)
  },
  {
    path: 'almacenes',
    loadChildren: ()=> import('./warehouses/warehouses.module').then((m) => m.WarehousesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
