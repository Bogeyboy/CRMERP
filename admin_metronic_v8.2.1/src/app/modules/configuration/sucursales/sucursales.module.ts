import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalesRoutingModule } from './sucursales-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule,Routes } from '@angular/router';
import { routes } from 'src/app/app-routing.module';
import { CreateSucursalComponent } from './create-sucursal/create-sucursal.component';
import { DeleteSucursalComponent } from './delete-sucursal/delete-sucursal.component';
import { EditSucursalComponent } from './edit-sucursal/edit-sucursal.component';
import { ListSucursalComponent } from './list-sucursal/list-sucursal.component';
import { SucursalesComponent } from './sucursales.component';


/* @NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SucursalesRoutingModule,
    // admin *.module.ts
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    RouterModule.forChild(routes)
  ]
}) */
@NgModule({
  declarations: [
    SucursalesComponent,
    CreateSucursalComponent,
    EditSucursalComponent,
    DeleteSucursalComponent,
    ListSucursalComponent
  ],
  imports: [
    CommonModule,
    SucursalesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})

  export class SucursalesModule { }
