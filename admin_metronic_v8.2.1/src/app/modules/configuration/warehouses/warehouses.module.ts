import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';
import { DeleteWarehouseComponent } from './delete-warehouse/delete-warehouse.component';
import { EditWarehouseComponent } from './edit-warehouse/edit-warehouse.component';
import { ListWarehouseComponent } from './list-warehouse/list-warehouse.component';
import { WarehousesComponent } from './warehouses.component';


@NgModule({ declarations: [
        WarehousesComponent,
        CreateWarehouseComponent,
        EditWarehouseComponent,
        DeleteWarehouseComponent,
        ListWarehouseComponent
    ], imports: [CommonModule,
        WarehousesRoutingModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        InlineSVGModule,
        NgbModalModule,
        NgbPaginationModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class WarehousesModule { }
