import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { CreateClientsPersonComponent } from './create-clients-person/create-clients-person.component';
import { EditClientsPersonComponent } from './edit-clients-person/edit-clients-person.component';
import { DeleteClientsComponent } from './delete-clients/delete-clients.component';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { EditClientsCompanyComponent } from './edit-clients-company/edit-clients-company.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CreateClientsCompanyComponent } from './create-clients-company/create-clients-company.component';


@NgModule({
  declarations:
  [
    ClientsComponent,
    CreateClientsCompanyComponent,
    EditClientsPersonComponent,
    EditClientsCompanyComponent,
    DeleteClientsComponent,
    ListClientsComponent,
  ],
  imports:
  [
    CreateClientsPersonComponent,
    CommonModule,
    ClientsRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class ClientsModule { }
