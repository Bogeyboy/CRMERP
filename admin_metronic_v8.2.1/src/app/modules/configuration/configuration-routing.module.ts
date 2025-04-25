import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //Ruta para la configuración de sucursales
  {
    path: 'sucursales',
    loadChildren: ()=> import('./sucursales/sucursales.module').then((m) => m.SucursalesModule)
  },
  //Ruta para la configuración de almacenes
  {
    path: 'almacenes',
    loadChildren: ()=> import('./warehouses/warehouses.module').then((m) => m.WarehousesModule)
  },
  //Ruta para la configuración de lugares de entrega
  {
    path: 'lugar-de-entrega',
    loadChildren: ()=> import('./sucursal-deliveries/sucursal-deliveries.module').then((m) => m.SucursalDeliveriesModule)
  },
  //Ruta para la configuración de métodos de pago
  {
    path: 'metodos-de-pago',
    loadChildren: ()=> import('./method-payment/method-payment.module').then((m) => m.MethodPaymentModule)
  },
  //Ruta para la configuración de segmentos de cliente
  {
    path: 'segmento-de-cliente',
    loadChildren: ()=> import('./client-segment/client-segment.module').then((m) => m.ClientSegmentModule)
  },
  //Ruta para la configuración de categorías de productos
  {
    path: 'categoria-de-productos',
    loadChildren: ()=> import('./product-categories/product-categories.module').then((m) => m.ProductCategoriesModule)
  },
  //Ruta para la configuración de proveedores
  {
    path: 'proveedores',
    loadChildren: ()=> import('./providers/providers.module').then((m) => m.ProvidersModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
