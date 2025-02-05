import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRolesComponent } from '../create-roles/create-roles.component';
import { RolesService } from '../service/roles.service';
import { EditRolesComponent } from '../edit-roles/edit-roles.component';
import { DeleteRolesComponent } from '../delete-roles/delete-roles.component';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent {
  
  search:string = '';
  ROLES:any[] = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;

  constructor(
    public modalService: NgbModal,
    public rolesService: RolesService,)
  {

  }
  
  ngOnInit(): void 
  {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.rolesService.isLoading$;
    this.listRoles();
  }

  //PARA CREAR UN ROL
  createRol()
  {
    const modalRef = this.modalService.open(CreateRolesComponent,{centered:true,size:'md'});
    //Recibimos los datos del componente hijo
    modalRef.componentInstance.RoleC.subscribe((rol:any) => {
      console.log(rol);
      this.ROLES.push(rol);//Se agrega al final del listado
      //this.ROLES.unshift(rol);//Se agrega al principio del listado
    });
  }

  //PARA LISTAR LOS ROLES
  listRoles(page = 1)
  {
    this.rolesService.listRoles(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.ROLES = resp.roles;
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  editRol(ROL:any)
  {
    const modalRef = this.modalService.open(EditRolesComponent,{centered:true,size:'md'});

    modalRef.componentInstance.ROL_SELECTED = ROL;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.RoleE.subscribe((rol:any) => {
      //this.ROLES.push(rol);//Se agrega al final del listado
      //this.ROLES.unshift(rol);//Se agrega al principio del listado
      let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
      if(INDEX!=-1)
      {
        this.ROLES[INDEX] = rol;
      }
    });
  }

  deleteRol(ROL:any)
    {
      const modalRef = this.modalService.open(DeleteRolesComponent,{centered:true,size:'md'});

      modalRef.componentInstance.ROL_SELECTED = ROL;

      //Recibimos los datos del componente hijo
      modalRef.componentInstance.RoleD.subscribe((rol:any) => {
        //this.ROLES.push(rol);//Se agrega al final del listado
        //this.ROLES.unshift(rol);//Se agrega al principio del listado
        let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
        if(INDEX!=-1)
        {
          //this.ROLES[INDEX] = rol;
          this.ROLES.splice(INDEX,1); //para eliminar un rol
        }
      });
    }

  //Función para las acciones tras el cambio de pagina en la paginación
  loadPage($event:any)
  {
    this.listRoles($event);
  }
}
