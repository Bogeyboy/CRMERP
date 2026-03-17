import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private URL_SERVICIOS = environment.URL_SERVICIOS;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registerProduct(formData: FormData) {
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/products";
    return this.http.post(URL, formData,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  /* listProducts(page = 1,data:any = null){
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/products/index?page="+page;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  } */

  /* listProducts(page: number, filters: any) {
    // Verifica que los filtros se están enviando como parámetros GET
    console.log('📤 Enviando al backend (desde servicio):', filters);

    // Construir query params
    let params = new HttpParams()
      .set('page', page.toString());

    // Agregar filtros no vacíos
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key].toString());
        console.log(`➕ Parámetro agregado: ${key} = ${filters[key]}`);
      }
    });

    return this.http.get(`${this.URL_SERVICIOS}/products`, { params });
  } */

  listProducts(page: number, filters: any) {
    this.isLoadingSubject.next(true);

    console.log('📤 Enviando al backend (desde servicio):', filters);
    console.log('📄 Página:', page);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authservice.token,
      'Content-Type': 'application/json'
    });

    // Construir URL con página
    const URL = `${URL_SERVICIOS}/products/index?page=${page}`;

    // Enviar filtros en el body (POST)
    return this.http.post(URL, filters, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  showProduct(PRODUCT_ID:string){
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/products/"+PRODUCT_ID;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  configAll(){
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/products/config";
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  /* updateProduct(PRODUCT_ID:string,data:any) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/products/"+PRODUCT_ID;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  } */
  updateProduct(PRODUCT_ID: string, data: any) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/products/"+PRODUCT_ID;
    // Cambiar de put a post
    return this.http.post(URL, data, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  /* updateProduct(PRODUCT_ID: string, data: any) {
    this.isLoadingSubject.next(true);
    // No establecer Content-Type, dejar que el navegador lo haga automáticamente
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/products/"+PRODUCT_ID;
    return this.http.put(URL, data, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  } */

  // deleteUser(ID_USER:string) {
  //   this.isLoadingSubject.next(true);
  //   let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
  //   let URL = URL_SERVICIOS+"/users/"+ID_USER;
  //   return this.http.delete(URL,{headers: headers}).pipe(
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

}
