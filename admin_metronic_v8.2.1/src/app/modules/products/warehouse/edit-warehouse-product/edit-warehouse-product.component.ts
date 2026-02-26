import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ProductWarehousesService } from '../../service/product-warehouses.service';

@Component({
  selector: 'app-edit-warehouse-product',
  //imports: [],
  templateUrl: './edit-warehouse-product.component.html',
  styleUrls: ['./edit-warehouse-product.component.scss']
})
export class EditWarehouseProductComponent {

  @Input() WAREHOUSES_PROD: any;
  @Input() UNITS: any = [];
  @Input() WAREHOUSES: any = [];
  @Input() PRODUCT_WAREHOUSE_ID: string; // NUEVO INPUT
  @Input() PRODUCT_ID: string; // ✅ Recibir PRODUCT_ID del padre

  @Output() WarehouseE = new EventEmitter<any>();

  isLoading:any;


  isLoading$:any;
  unit_warehouse:string;
  almacen_warehouse:string;
  quantity_warehouse:number;
  //ProductWarehousesService: any;

  constructor(
      public modal:NgbActiveModal,
      private http: HttpClient,
      public authservice: AuthService,
      public productWarehouseService: ProductWarehousesService,
      public toast: ToastrService,
    )
  {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log("WAREHOUSES_PROD en hijo:", JSON.stringify(this.WAREHOUSES_PROD, null, 2));
    console.log("PRODUCT_ID recibido:", this.PRODUCT_ID); // Debug

    if (this.WAREHOUSES_PROD) {
      this.almacen_warehouse = this.WAREHOUSES_PROD.warehouse?.id?.toString() || '';
      this.unit_warehouse = this.WAREHOUSES_PROD.unit?.id?.toString() || '';
      this.quantity_warehouse = this.WAREHOUSES_PROD.quantity || 0;
    }
  }

  isLoadingProcess(){
    this.productWarehouseService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productWarehouseService.isLoadingSubject.next(false);
    }, 50);
  }
  //Función para guardar los permisos

  store() {
    if(!this.almacen_warehouse || !this.unit_warehouse || !this.quantity_warehouse) {
      this.toast.error("VALIDACIÓN", "Necesitas seleccionar un almacén, una unidad y colocar la cantidad");
      return;
    }

    // Verificar que tenemos el PRODUCT_ID
    if (!this.PRODUCT_ID) {
      console.error("PRODUCT_ID no está definido");
      this.toast.error("ERROR", "Error: ID del producto no disponible");
      return;
    }

    const data = {
      unit_id: this.unit_warehouse,
      warehouse_id: this.almacen_warehouse,
      stock: this.quantity_warehouse, // Cambiado a 'stock' para coincidir con backend
      product_id: this.PRODUCT_ID
    };

    console.log("Data a enviar para actualización:", data);

    this.productWarehouseService.updateProductWarehouse(this.WAREHOUSES_PROD.id, data).subscribe({
      next: (resp: any) => {
        console.log("Respuesta actualización:", resp);

        // Crear objeto actualizado
        const updatedWarehouse = {
          id: this.WAREHOUSES_PROD.id,
          unit: this.UNITS.find(u => u.id == this.unit_warehouse),
          warehouse: this.WAREHOUSES.find(w => w.id == this.almacen_warehouse),
          quantity: this.quantity_warehouse
        };

        this.WarehouseE.emit(updatedWarehouse);
        this.toast.success("ÉXITO", "Almacén actualizado correctamente");
        this.modal.dismiss();
      },
      error: (error) => {
        console.error("Error al actualizar:", error);
        this.toast.error("ERROR", "No se pudo actualizar el almacén");
      }
    });
    this.isLoadingProcess();
  }
}
