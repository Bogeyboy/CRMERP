import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProformasService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private apiUrl: string;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.apiUrl = environment.URL_SERVICIOS; // 'http://127.0.0.1:8000/api'
  }
  
  searchClients(n_document: string, full_name: string, phone: string)
  {
    let LINK = '';
    if (n_document)
    {
      LINK += `&n_document=${n_document}`;
    }
    if (full_name)
    {
      LINK += `&full_name=${full_name}`;
    }
    
    if (phone)
    {
      LINK += `&phone=${phone}`;
    }
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});

    const URL = `${this.apiUrl}/proforma/search-clients?k=1`+LINK;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  configAll()
  {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});

    const URL = `${this.apiUrl}/proforma/config`;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
