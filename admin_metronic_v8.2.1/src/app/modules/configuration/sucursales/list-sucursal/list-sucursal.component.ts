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
    editSucursal(SUCURSAL:any)
    {
      const modalRef = this.modalService.open(EditSucursalComponent,{centered:true,size:'md'});
  
      modalRef.componentInstance.SUCURSAL_SELECTED = SUCURSAL;
  
      //Recibimos los datos del componente hijo
      modalRef.componentInstance.SucursalE.subscribe((sucursal:any) => {
        let INDEX = this.SUCURSALES.findIndex((sucurs:any) => sucurs.id == SUCURSAL.id);
        //console.log(INDEX);
        if(INDEX!=-1)
        {
          this.SUCURSALES[INDEX] = sucursal;
        }
      });
    }
    //Eliminación de sucursal
    deleteSucursal(SUCURSAL:any)
    {
      const modalRef = this.modalService.open(DeleteSucursalComponent,{centered:true,size:'md'});

      modalRef.componentInstance.SUCURSAL_SELECTED = SUCURSAL;

      //Recibimos los datos del componente hijo
      modalRef.componentInstance.SucursalD.subscribe((sucursal:any) => {
        let INDEX = this.SUCURSALES.findIndex((sucurs:any) => sucurs.id == SUCURSAL.id);
        if(INDEX!=-1)
        {
          //this.ROLES[INDEX] = rol;
          this.SUCURSALES.splice(INDEX,1); //para eliminar un rol
        }
      });
    }
  
    //Función para las acciones tras el cambio de pagina en la paginación
    loadPage($event:any)
    {
      this.listSucursales($event);
    }
}
