import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProformasRoutingModule } from './proformas-routing.module';
import { ProformasComponent } from './proformas.component';
import { CreateProformaComponent } from './create-proforma/create-proforma.component';
import { EditProformaComponent } from './edit-proforma/edit-proforma.component';
import { DeleteProformaComponent } from './delete-proforma/delete-proforma.component';
import { ListProformasComponent } from './list-proforma/list-proforma.component';
import { SearchProductsComponent } from './components/search-products/search-products.component';
import { AddPaymentsComponent } from './components/add-payments/add-payments.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SearchClientsComponent } from './components/search-clients/search-clients.component';
import { FormatNumberPipe } from '../../pipes/format-number.pipe';
import { OpenDetailProformaComponent } from './components/open-detail-proforma/open-detail-proforma.component';


@NgModule({
  declarations: [
    ProformasComponent,
    OpenDetailProformaComponent,
    EditProformaComponent,
    DeleteProformaComponent,
    ListProformasComponent,
    AddPaymentsComponent,
  ],
  imports: [
    CommonModule,
    ProformasRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    CreateProformaComponent,
    SearchProductsComponent,
    SearchClientsComponent,
    FormatNumberPipe
]
})
export class ProformasModule { }
