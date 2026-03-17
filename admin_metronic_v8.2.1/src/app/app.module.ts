import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

//import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
//import { error } from 'console';
// #fake-end#

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@tsExpetc-errort;
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

const mockImports = environment.isMockEnabled
  ? [
      HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
    ]
  : [];

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([

        ]),
        TranslateModule.forRoot(),
        InlineSVGModule.forRoot(),
        ClipboardModule,
        AppRoutingModule,
        InlineSVGModule.forRoot(),
        NgbModule,
        NgApexchartsModule,
        ToastrModule.forRoot({
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        }),
        NgbPaginationModule,
        ...mockImports
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [AuthService],
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class AppModule { }
