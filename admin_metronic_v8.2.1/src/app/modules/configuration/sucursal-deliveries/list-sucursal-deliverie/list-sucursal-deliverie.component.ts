import { Component } from '@angular/core';
import { DeleteSucursalDeliverieComponent } from '../delete-sucursal-deliverie/delete-sucursal-deliverie.component';
import { EditSucursalDeliverieComponent } from '../edit-sucursal-deliverie/edit-sucursal-deliverie.component';
import { CreateSucursalDeliverieComponent } from '../create-sucursal-deliverie/create-sucursal-deliverie.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalDeliverieService } from '../service/sucursal-deliverie.service';

@Component({
  selector: 'app-list-sucursal-deliverie',
  //imports: [],
  templateUrl: './list-sucursal-deliverie.component.html',
  styleUrls: ['./list-sucursal-deliverie.component.scss']
})
export class ListSucursalDeliverieComponent {
  search:string = '';
      SUCURSALES_DELIVERIES:any[];
      isLoading$:any;
    
      totalPages:number = 0;
      currentPage:number = 1;
    
      constructor(
        public modalService: NgbModal,
        public sucursalDeliverieService: SucursalDeliverieService,)
      {
    
      }
      
      ngOnInit(): void 
      {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.isLoading$ = this.sucursalDeliverieService.isLoading$;
        this.listSucursalDeliverie();
      }
    
      //PARA CREAR UNA SUCURSAL
      createSucursalDeliverie()
      {
        const modalRef = this.modalService.open(CreateSucursalDeliverieComponent,{centered:true,size:'md'});
        //Recibimos los datos del componente hijo
        modalRef.componentInstance.SucursalC.subscribe((sucursal:any) => {
          console.log(sucursal);
          //this.SUCURSALES_DELIVERIES.push(sucursal);//Se agrega al final del listado
          this.SUCURSALES_DELIVERIES.unshift(sucursal);//Se agrega al principio del listado
        });
      }
    
      //PARA LISTAR LAS SUCURSALES_DELIVERIES
      listSucursalDeliverie(page = 1)
      {
        this.sucursalDeliverieService.listSucursalDeliverie(page,this.search).subscribe((resp:any) => {
          console.log(resp);
          this.SUCURSALES_DELIVERIES = resp.sucursal_deliverie;
          this.totalPages = resp.total;
          this.currentPage = page;
        });
      }
      //Edición de sucursal
      editSucursalDeliverie(SUCURSAL:any)
      {
        const modalRef = this.modalService.open(EditSucursalDeliverieComponent,{centered:true,size:'md'});
    
        modalRef.componentInstance.SUCURSAL_SELECTED = SUCURSAL;
    
        //Recibimos los datos del componente hijo
        modalRef.componentInstance.SucursalE.subscribe((sucursal:any) => {
          let INDEX = this.SUCURSALES_DELIVERIES.findIndex((sucurs:any) => sucurs.id == SUCURSAL.id);
          //console.log(INDEX);
          if(INDEX!=-1)
          {
            this.SUCURSALES_DELIVERIES[INDEX] = sucursal;
          }
        });
      }
      //Eliminación de sucursal
      deleteSucursalDeliverie(SUCURSAL:any)
      {
        const modalRef = this.modalService.open(DeleteSucursalDeliverieComponent,{centered:true,size:'md'});
  
        modalRef.componentInstance.SUCURSAL_SELECTED = SUCURSAL;
  
        //Recibimos los datos del componente hijo
        modalRef.componentInstance.SucursalD.subscribe((sucursal:any) => {
          let INDEX = this.SUCURSALES_DELIVERIES.findIndex((sucurs:any) => sucurs.id == SUCURSAL.id);
          if(INDEX!=-1)
          {
            //this.ROLES[INDEX] = rol;
            this.SUCURSALES_DELIVERIES.splice(INDEX,1); //para eliminar un rol
          }
        });
      }
    
      //Función para las acciones tras el cambio de pagina en la paginación
      loadPage($event:any)
      {
        this.listSucursalDeliverie($event);
      }
}
