import { Component } from '@angular/core';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
// import { ListUsersComponent } from './list-users/list-users.component';
import { UsersService } from '../service/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent {
search:string = '';
  USER:any[] = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;

  constructor(
    public modalService: NgbModal,
    public userService: UsersService,)
  {

  }
  
  ngOnInit(): void 
  {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.userService.isLoading$;
    this.listUsers();
  }

  //PARA CREAR UN USER
  createUser()
  {
    const modalRef = this.modalService.open(CreateUserComponent,{centered:true,size:'md'});
    //Recibimos los datos del componente hijo
    modalRef.componentInstance.RoleC.subscribe((rol:any) => {
      console.log(rol);
      this.USER.push(rol);//Se agrega al final del listado
    });
  }

  //PARA LISTAR LOS ROLES
  listUsers(page = 1)
  {
    this.userService.listUsers(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.USER = resp.roles;
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  editUser(USER:any)
  {
    const modalRef = this.modalService.open(EditUserComponent,{centered:true,size:'md'});

    modalRef.componentInstance.USER_SELECTED = USER;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.RoleE.subscribe((user:any) => {
      let INDEX = this.USER.findIndex((user:any) => user.id == USER.id);
      if(INDEX!=-1)
      {
        this.USER[INDEX] = user;
      }
    });
  }

  deleteUser(USER:any)
    {
      const modalRef = this.modalService.open(DeleteUserComponent,{centered:true,size:'md'});

      modalRef.componentInstance.USER_SELECTED = USER;

      //Recibimos los datos del componente hijo
      modalRef.componentInstance.RoleD.subscribe((user:any) => {
        //this.USER.push(rol);//Se agrega al final del listado
        let INDEX = this.USER.findIndex((user:any) => user.id == USER.id);
        if(INDEX!=-1)
        {
          this.USER.splice(INDEX,1); //para eliminar un usuario
        }
      });
    }

  //Función para las acciones tras el cambio de pagina en la paginación
  loadPage($event:any)
  {
    this.listUsers($event);
  }
}