import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoriesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  private baseUrl = environment.apiUrl;
  private apiUrl = environment.URL_SERVICIOS + '/product_categories';/* '{$this.baseUrl}/product_categories'; */
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    console.log('📡 Servicio inicializado con URL:', this.apiUrl);
  }
  registerProductCategorie(formData: FormData) {
    //this.isLoadingSubject.next(true);
    //const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    //const URL = URL_SERVICIOS+"/product_categories";
    //return this.http.post(URL,data,{headers: headers}).pipe(
      //finalize(() => this.isLoadingSubject.next(false))
    //);

    //return this.http.post(URL,FormData);
    console.log('📤 Enviando petición a:', this.apiUrl);
    return this.http.post(this.apiUrl, formData).pipe(finalize(() => this.isLoadingSubject.next(false)));
    
  }
  listProductCategories(page = 1,search = '') {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/product_categories?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  getCategories(search): Observable<any> {
    return this.http.get(`${this.apiUrl}?search=${search}`);
  }
  updateProductCategorie(ID_PRODUCT_CATEGORIE:string,data:any) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    //console.log(data);
    const URL = URL_SERVICIOS + '/product_categories/' + ID_PRODUCT_CATEGORIE;
    //console.log(URL);
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  deleteProductCategorie(ID_PRODUCT_CATEGORIE:string) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS + '/product_categories/' + ID_PRODUCT_CATEGORIE;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}