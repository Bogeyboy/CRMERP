import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    
    constructor(
      private http: HttpClient,
      public authservice: AuthService,
    ) {
      this.isLoadingSubject = new BehaviorSubject<boolean>(false);
      this.isLoading$ = this.isLoadingSubject.asObservable();
    }
  
    registerProvider(data:any) {
      console.log(data);
      this.isLoadingSubject.next(true);
      let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
      let URL = URL_SERVICIOS+"/providers";
      return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
      );
    }
  
    listProviders(page = 1,search:string = ''){
      this.isLoadingSubject.next(true);
      let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
      let URL = URL_SERVICIOS+"/providers?page="+page+"&search="+search;
      return this.http.get(URL,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
  
    updateProvider(ID_PROVIDER:string,data:any) {
      this.isLoadingSubject.next(true);
      let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
      //console.log(data);
      let URL = URL_SERVICIOS + '/providers/' + ID_PROVIDER;
      //console.log(URL);
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
  
    deleteProvider(ID_PROVIDER:string) {
      this.isLoadingSubject.next(true);
      let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
      let URL = URL_SERVICIOS + '/providers/' + ID_PROVIDER;
      return this.http.delete(URL,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
}
