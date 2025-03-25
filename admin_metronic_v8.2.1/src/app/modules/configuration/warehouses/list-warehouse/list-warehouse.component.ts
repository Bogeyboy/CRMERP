import { Component } from '@angular/core';
import { WarehouseService } from '../service/warehouse.service';
import { CreateWarehouseComponent } from '../create-warehouse/create-warehouse.component';
import { EditWarehouseComponent } from '../edit-warehouse/edit-warehouse.component';
import { DeleteWarehouseComponent } from '../delete-warehouse/delete-warehouse.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-warehouse',
  //imports: [],
  templateUrl: './list-warehouse.component.html',
  styleUrls: ['./list-warehouse.component.scss']
})
export class ListWarehouseComponent {
    search:string = '';
    WAREHOUSES:any = [];
    SUCURSALES:any = [];
    isLoading$:any;
  
    totalPages:number = 0;
    currentPage:number = 1;
  
    constructor(
      public modalService: NgbModal,
      public warehouseService: WarehouseService,)
    {
  
    }
    
    ngOnInit(): void 
    {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.isLoading$ = this.warehouseService.isLoading$;
      this.listWarehouses();
    }
  
    //PARA CREAR UNA SUCURSAL
    createWarehouse()
    {
      const modalRef = this.modalService.open(CreateWarehouseComponent,{centered:true,size:'md'});
      modalRef.componentInstance.SUCURSALES = this.SUCURSALES;
      
      //Recibimos los datos del componente hijo
      modalRef.componentInstance.WarehouseC.subscribe((warehouse:any) => {
        console.log(warehouse);
        //this.SUCURSALES.push(sucursal);//Se agrega al final del listado
        this.WAREHOUSES.unshift(warehouse);//Se agrega al principio del listado
      });
    }
  
    //PARA LISTAR LAS SUCURSALES
    listWarehouses(page = 1)
    {
      this.warehouseService.listWarehouses(page,this.search).subscribe((resp:any) => {
        console.log(resp);
        this.WAREHOUSES = resp.warehouses;
        this.totalPages = resp.total;
        this.currentPage = page;
        this.SUCURSALES = resp.sucursales;
      });
    }
    //Edición de sucursal
    editWarehouse(WAREHOUSE:any)
    {
      const modalRef = this.modalService.open(EditWarehouseComponent,{centered:true,size:'md'});
  
      modalRef.componentInstance.WAREHOUSE_SELECTED = WAREHOUSE;
      modalRef.componentInstance.SUCURSALES = this.SUCURSALES;
  
      //Recibimos los datos del componente hijo
      modalRef.componentInstance.WarehouseE.subscribe((warehouse:any) => {
        let INDEX = this.WAREHOUSES.findIndex((wareho:any) => wareho.id == WAREHOUSE.id);
        if(INDEX!=-1)
        {
          this.WAREHOUSES[INDEX] = warehouse;
        }
      });
    }
    //Eliminación de sucursal
    deleteWarehouse(WAREHOUSE:any)
    {
      const modalRef = this.modalService.open(DeleteWarehouseComponent,{centered:true,size:'md'});

      modalRef.componentInstance.WAREHOUSE_SELECTED = WAREHOUSE;

      //Recibimos los datos del componente hijo
      modalRef.componentInstance.WarehouseD.subscribe((sucursal:any) => {
        let INDEX = this.WAREHOUSES.findIndex((wareho:any) => wareho.id == WAREHOUSE.id);
        if(INDEX!=-1)
        {
          this.WAREHOUSES.splice(INDEX,1); //para eliminar un rol
        }
      });
    }
  
    //Función para las acciones tras el cambio de pagina en la paginación
    loadPage($event:any)
    {
      this.listWarehouses($event);
    }
}
