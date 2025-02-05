import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //Código base para cualquier servicio que se realice con metronic

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  //Función para el registro de roles
    registerUser(data:any)
    {
      this.isLoadingSubject.next(true);
  
      let URL =URL_SERVICIOS + '/users';
      //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);
  
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
    //Funcion para el listado de roles
    listUsers(page = 1, search:string = '')
    {
      this.isLoadingSubject.next(true);
  
      let URL =URL_SERVICIOS + '/users?page' + page +'&search=' + search;
      //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);
  
      return this.http.get(URL,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
    //Función para la edición de roles
    updateUser(ID_USER:string,data:any)
    {
      this.isLoadingSubject.next(true);
  
      let URL =URL_SERVICIOS + '/users/' + ID_USER;
      //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);
  
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
  
    //Función para eliminar roles
    deleteUser(ID_USER:string)
    {
      this.isLoadingSubject.next(true);
  
      let URL =URL_SERVICIOS + '/users/' + ID_USER;
      //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);
  
      return this.http.delete(URL,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
}
