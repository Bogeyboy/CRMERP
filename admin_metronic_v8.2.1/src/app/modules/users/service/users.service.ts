import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map, catchError, tap } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }
  //Registro de usuarios
  registerUser(data:any) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/users";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  //Listado de usuarios
  listUsers(page = 1,search = ''){
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/users?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  //Actualización de usuarios
  /* updateUser(ID_USER:string,data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS+"/users/"+ID_USER;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  } */
 //URL_SERVICIOS: 'http://127.0.0.1:8000/api',
 updateUser(ID_USER:string,data:any) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/users/"+ID_USER;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  //Eliminación de usuarios
  deleteUser(ID_USER:string) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/users/"+ID_USER;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  configAll(){
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    const URL = URL_SERVICIOS+"/users/config";
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  getRoles() {
  this.isLoadingSubject.next(true);
  const headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
  const URL = URL_SERVICIOS + "/roles/list";

  console.log('🔍 Obteniendo roles desde:', URL); // Debug

  return this.http.get(URL, {headers: headers}).pipe(
    map((response: any) => {
      console.log('📦 Respuesta completa de /roles/list:', response);

      // La respuesta es {success: true, roles: [...]}
      if (response && response.success && response.roles) {
        console.log('✅ Roles encontrados:', response.roles.length);
        return response.roles; // Retornamos solo el array de roles
      }

      console.warn('⚠️ Formato de respuesta inesperado:', response);
      return []; // Retornar array vacío si el formato no es el esperado
    }),
    catchError((error) => {
      console.error('❌ Error obteniendo roles:', error);
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      return of([]); // Retornar array vacío en caso de error
    }),
    finalize(() => {
      console.log('🏁 Finalizada carga de roles');
      this.isLoadingSubject.next(false);
    })
  );
}
}
