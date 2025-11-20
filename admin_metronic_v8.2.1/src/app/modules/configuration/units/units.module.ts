import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitsRoutingModule } from './units-routing.module';
import { CreateUnitsComponent } from './create-units/create-units.component';
import { DeleteUnitsComponent } from './delete-units/delete-units.component';
import { EditUnitsComponent } from './edit-units/edit-units.component';
import { ListUnitsComponent } from './list-units/list-units.component';
import { UnitsComponent } from './units.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({ declarations: [
        UnitsComponent,
        CreateUnitsComponent,
        DeleteUnitsComponent,
        EditUnitsComponent,
        ListUnitsComponent,
    ], imports: [CommonModule,
        UnitsRoutingModule,
        RouterModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        InlineSVGModule,
        NgbModalModule,
        NgbPaginationModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class UnitsModule { }
