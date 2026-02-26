import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class ProductWalletsService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registerProductWallet(formData: FormData) {
      const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
      const URL = URL_SERVICIOS+"/product_wallets";
      return this.http.post(URL, formData,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }

  updateProductWallet(ID_WALLET_PRODUCT:string,data:any) {
    console.log(data);
    console.log("ID_WALLET_PRODUCT", ID_WALLET_PRODUCT);
    console.log("URL completa:", URL_SERVICIOS+"/product_wallets/"+ID_WALLET_PRODUCT);
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/product_wallets/"+ID_WALLET_PRODUCT;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteProductWallet(ID_WALLET_PRODUCT:string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS+"/product_wallets/"+ID_WALLET_PRODUCT;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
