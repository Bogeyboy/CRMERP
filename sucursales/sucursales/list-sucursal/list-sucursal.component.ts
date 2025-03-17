import { Component } from '@angular/core';
import { SucursalService } from '../service/sucursal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSucursalComponent } from '../create-sucursal/create-sucursal.component';
import { EditSucursalComponent } from '../edit-sucursal/edit-sucursal.component';
import { DeleteSucursalComponent } from '../delete-sucursal/delete-sucursal.component';

@Component({
  selector: 'app-list-sucursal',
  //imports: [],
  templateUrl: './list-sucursal.component.html',
  styleUrls: ['./list-sucursal.component.scss']
})
export class ListSucursalComponent {
  search:string = '';
    SUCURSALES:any[];
    isLoading$:any;
  
    totalPages:number = 0;
    currentPage:number = 1;
  
    constructor(
      public modalService: NgbModal,
      public sucursalService: SucursalService,)
    {
  
    }
    
    ngOnInit(): void 
    {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.isLoading$ = this.sucursalService.isLoading$;
      this.listSucursales();
    }
  
    //PARA CREAR UNA SUCURSAL
    createSucursal()
    {
      const modalRef = this.modalService.open(CreateSucursalComponent,{centered:true,size:'md'});
      //Recibimos los datos del componente hijo
      modalRef.componentInstance.SucursalC.subscribe((sucursal:any) => {
        console.log(sucursal);
        //this.SUCURSALES.push(sucursal);//Se agrega al final del listado
        this.SUCURSALES.unshift(sucursal);//Se agrega al principio del listado
      });
    }
  
    //PARA LISTAR LAS SUCURSALES
    listSucursales(page = 1)
    {
      this.sucursalService.listSucursales(page,this.search).subscribe((resp:any) => {
        console.log(resp);
        this.SUCURSALES = resp.sucursales;
        this.totalPages = resp.total;
        this.currentPage = page;
      });
    }
    //Edición de sucursal
    editSucursal(ROL:any)
    {
      const modalRef = this.modalService.open(EditSucursalComponent,{centered:true,size:'md'});
  
      modalRef.componentInstance.ROL_SELECTED = ROL;
  
      //Recibimos los datos del componente hijo
      modalRef.componentInstance.RoleE.subscribe((rol:any) => {
        //this.ROLES.push(rol);//Se agrega al final del listado
        //this.ROLES.unshift(rol);//Se agrega al principio del listado
        /* let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
        if(INDEX!=-1)
        {
          this.ROLES[INDEX] = rol;
        } */
      });
    }
    //Eliminación de sucursal
    deleteSucursal(ROL:any)
    {
      const modalRef = this.modalService.open(DeleteSucursalComponent,{centered:true,size:'md'});

      modalRef.componentInstance.ROL_SELECTED = ROL;

      //Recibimos los datos del componente hijo
      modalRef.componentInstance.RoleD.subscribe((rol:any) => {
        //this.ROLES.push(rol);//Se agrega al final del listado
        //this.ROLES.unshift(rol);//Se agrega al principio del listado
        /* let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
        if(INDEX!=-1)
        {
          //this.ROLES[INDEX] = rol;
          this.ROLES.splice(INDEX,1); //para eliminar un rol
        } */
      });
    }
  
    //Función para las acciones tras el cambio de pagina en la paginación
    loadPage($event:any)
    {
      this.listSucursales($event);
    }
}
