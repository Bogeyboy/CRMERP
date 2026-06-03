import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ProductWarehousesService } from '../../service/product-warehouses.service';

@Component({
  selector: 'app-delete-warehouse-product',
  //mports: [],
  templateUrl: './delete-warehouse-product.component.html',
  styleUrls: ['./delete-warehouse-product.component.scss']
})
export class DeleteWarehouseProductComponent {
  @Output() WarehouseD = new EventEmitter<any>();
  //recibiendo datos del componente padre
  @Input() WAREHOUSES_PROD:any;
  @Input() WAREHOUSES: any = []; // ← AGREGAR ESTO

  //Variables
  isLoading:any;

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
  }
  //Función para guardar los permisos
  delete() {
    // Obtener el ID de diferentes posibles ubicaciones
    const id = this.WAREHOUSES_PROD?.id || 
              this.WAREHOUSES_PROD?.pivot?.id || 
              this.WAREHOUSES_PROD?.warehouse_id;
    
    console.log("ID a eliminar:", id);
    console.log("Objeto completo:", this.WAREHOUSES_PROD);
    
    if (!id) {
      this.toast.error("ERROR", "No se pudo identificar el registro a eliminar");
      return;
    }

    this.productWarehouseService.deleteProductWarehouse(id).subscribe({
      next: (resp: any) => {
        console.log("Eliminado correctamente:", resp);
        this.WarehouseD.emit(this.WAREHOUSES_PROD);
        this.toast.success("ÉXITO", "Registro eliminado correctamente");
        this.modal.dismiss();
      },
      error: (error) => {
        console.error("Error al eliminar:", error);
        this.toast.error("ERROR", "No se pudo eliminar el registro: " + (error.error?.message || error.message));
      }
    });
  }

  getWarehouseName(): string {
    if (this.WAREHOUSES_PROD?.warehouse?.name) {
      return this.WAREHOUSES_PROD.warehouse.name;
    }
    if (this.WAREHOUSES_PROD?.pivot?.warehouse_id) {
      const warehouse = this.WAREHOUSES.find(w => w.id == this.WAREHOUSES_PROD.pivot.warehouse_id);
      return warehouse?.name || 'Sin nombre';
    }
    return 'Sin nombre';
  }
}
