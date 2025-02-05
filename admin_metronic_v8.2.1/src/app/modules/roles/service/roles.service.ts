import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
//import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    //public rolesService: RolesService,
    //public toast: ToastrService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  //URL_SERVICIOS = 'http://localhost:8000/api';
  //Función para el registro de roles
  registerRole(data:any)
  {
    this.isLoadingSubject.next(true);

    let URL =URL_SERVICIOS + '/roles';
    //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);

    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  //Funcion para el listado de roles
  listRoles(page = 1, search:string = '')
  {
    this.isLoadingSubject.next(true);

    let URL =URL_SERVICIOS + '/roles?page' + page +'&search=' + search;
    //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);

    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  //Función para la edición de roles
  updateRol(ID_ROL:string,data:any)
  {
    this.isLoadingSubject.next(true);

    let URL =URL_SERVICIOS + '/roles/' + ID_ROL;
    //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);

    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  //Función para eliminar roles
  deleteRol(ID_ROL:string)
  {
    this.isLoadingSubject.next(true);

    let URL =URL_SERVICIOS + '/roles/' + ID_ROL;
    //let headers = new HttpHeaders('Authorization': 'Bearer '+ this.authservice.token);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authservice.token);

    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}