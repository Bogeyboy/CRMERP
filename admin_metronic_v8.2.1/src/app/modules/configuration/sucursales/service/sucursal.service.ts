import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  //URL_SERVICIOS = 'http://localhost:8000/api';
    //Función para el registro de sucursales
    registerSucursal(data:any)
    {
      this.isLoadingSubject.next(true);
  
      let URL =URL_SERVICIOS + '/sucursales';
      //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);
  
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
    //Funcion para el listado de sucursales
    listSucursales(page = 1, search:string = '')
    {
      this.isLoadingSubject.next(true);
  
      let URL =URL_SERVICIOS + '/sucursales?page' + page +'&search=' + search;
      //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);
  
      return this.http.get(URL,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
    //Función para la edición de sucursales
    updateSucursal(ID_SUCURSAL:string,data:any)
    {
      this.isLoadingSubject.next(true);
  
      let URL =URL_SERVICIOS + '/sucursales/' + ID_SUCURSAL;
      //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);
  
      return this.http.put(URL,data,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
  
    //Función para eliminar sucursales
    deleteSucursal(ID_SUCURSAL:string)
    {
      this.isLoadingSubject.next(true);
  
      let URL =URL_SERVICIOS + '/sucursales/' + ID_SUCURSAL;
      //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);
  
      return this.http.delete(URL,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
}
