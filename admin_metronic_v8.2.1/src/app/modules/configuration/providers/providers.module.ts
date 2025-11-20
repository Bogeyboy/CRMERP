import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ProvidersComponent } from './providers.component';
import { CreateProvidersComponent } from './create-providers/create-providers.component';
import { DeleteProvidersComponent } from './delete-providers/delete-providers.component';
import { EditProvidersComponent } from './edit-providers/edit-providers.component';
import { ListProvidersComponent } from './list-providers/list-providers.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({ declarations: [
        ProvidersComponent,
        CreateProvidersComponent,
        DeleteProvidersComponent,
        EditProvidersComponent,
        ListProvidersComponent
    ], imports: [CommonModule,
        ProvidersRoutingModule,
        RouterModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        InlineSVGModule,
        NgbModalModule,
        NgbPaginationModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ProvidersModule { }
