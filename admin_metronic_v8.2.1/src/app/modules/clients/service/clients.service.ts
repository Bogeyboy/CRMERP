import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { URL_SERVICIOS } from '../../../config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registerClient(data:any)
  {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/clients";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listConfig()
  {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/clients/config";
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listClients(page = 1,data:any = {})
  {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/clients/index?page="+page;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateClient(ID_CLIENT_SEGMENT:string,data:any)
  {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    //console.log(data);
    const URL = URL_SERVICIOS + '/clients/' + ID_CLIENT_SEGMENT;
    //console.log(URL);
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteClient(ID_CLIENT_SEGMENT:string)
  {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS + '/clients/' + ID_CLIENT_SEGMENT;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  //importClient(data:any)
  importClient(formData: FormData, headers?: any)
  {
    this.isLoadingSubject.next(true);
    const defaultHeaders = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    //const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/clients/import";
    return this.http.post(URL, formData,{
      headers: headers || defaultHeaders,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
