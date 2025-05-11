import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ClientSegmentModule } from '../configuration/client-segment/client-segment.module';
import { ConfigurationRoutingModule } from '../configuration/configuration-routing.module';
import { MethodPaymentModule } from '../configuration/method-payment/method-payment.module';
import { ProductCategoriesModule } from '../configuration/product-categories/product-categories.module';
import { ProvidersModule } from '../configuration/providers/providers.module';
import { SucursalDeliveriesModule } from '../configuration/sucursal-deliveries/sucursal-deliveries.module';
import { SucursalesModule } from '../configuration/sucursales/sucursales.module';
import { UnitsModule } from '../configuration/units/units.module';
import { WarehousesModule } from '../configuration/warehouses/warehouses.module';
import { CreateUnitsComponent } from '../configuration/units/create-units/create-units.component';
import { ListProductComponent } from './list-product/list-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { ProductsComponent } from './products.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductComponent,
    ListProductComponent,
    EditProductComponent,
    DeleteProductComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,

    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class ProductsModule { }
