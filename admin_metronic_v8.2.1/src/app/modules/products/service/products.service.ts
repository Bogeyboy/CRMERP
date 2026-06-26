import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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

  registerProduct(formData: FormData) {
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = `${this.apiUrl}/products`;
    return this.http.post(URL, formData,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listProducts(page: number, filters: any) {
    this.isLoadingSubject.next(true);

    console.log('📤 Enviando al backend (desde servicio):', filters);
    console.log('📄 Página:', page);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authservice.token,
      'Content-Type': 'application/json'
    });

    const URL = `${this.apiUrl}/products/index?page=${page}`;

    return this.http.post(URL, filters, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  importProduct(formData: FormData, headers?: any) {
    const defaultHeaders = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = `${this.apiUrl}/products/import`;
    return this.http.post(URL, formData,{
      headers: headers || defaultHeaders,
    }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showProduct(PRODUCT_ID:string){
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = `${this.apiUrl}/products/${PRODUCT_ID}`;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  configAll(){
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = `${this.apiUrl}/products/config`;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateProduct(PRODUCT_ID: string, data: any) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = `${this.apiUrl}/products/${PRODUCT_ID}`;

    // Si es FormData, agregar _method=PUT y usar POST
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
        console.log('📤 Enviando FormData con _method=PUT a:', URL);
        return this.http.post(URL, data, {headers: headers}).pipe(
          finalize(() => this.isLoadingSubject.next(false))
        );
    }

    // Si es objeto normal, usar PUT
    return this.http.put(URL, data, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
