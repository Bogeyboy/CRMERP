import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ProductWarehousesService } from '../../service/product-warehouses.service';

@Component({
  selector: 'app-edit-warehouse-product',
  templateUrl: './edit-warehouse-product.component.html',
  styleUrls: ['./edit-warehouse-product.component.scss']
})
export class EditWarehouseProductComponent {

  @Input() WAREHOUSES_PROD: any;
  @Input() UNITS: any = [];
  @Input() WAREHOUSES: any = [];
  @Input() PRODUCT_WAREHOUSE_ID: string;
  @Input() PRODUCT_ID: string;

  @Output() WarehouseE = new EventEmitter<any>();

  isLoading: any;
  isLoading$: any;
  unit_warehouse: string;
  almacen_warehouse: string;
  quantity_warehouse: number;

  constructor(
    public modal: NgbActiveModal,
    private http: HttpClient,
    public authservice: AuthService,
    public productWarehouseService: ProductWarehousesService,
    public toast: ToastrService,
  ) { }

  ngOnInit(): void {
    console.log("WAREHOUSES_PROD en hijo:", JSON.stringify(this.WAREHOUSES_PROD, null, 2));
    console.log("PRODUCT_ID recibido:", this.PRODUCT_ID);
    console.log("PRODUCT_WAREHOUSE_ID recibido:", this.PRODUCT_WAREHOUSE_ID);
    console.log("WAREHOUSES disponibles:", this.WAREHOUSES);
    console.log("UNITS disponibles:", this.UNITS);

    if (this.WAREHOUSES_PROD) {
      // Inicializar valores del formulario
      if (this.WAREHOUSES_PROD.pivot) {
        // Estructura con pivot
        this.almacen_warehouse = this.WAREHOUSES_PROD.pivot.warehouse_id?.toString() || '';
        this.unit_warehouse = this.WAREHOUSES_PROD.pivot.unit_id?.toString() || '';
        this.quantity_warehouse = this.WAREHOUSES_PROD.pivot.stock || 0;
      } else if (this.WAREHOUSES_PROD.warehouse_id) {
        // Estructura con warehouse_id directo
        this.almacen_warehouse = this.WAREHOUSES_PROD.warehouse_id?.toString() || '';
        this.unit_warehouse = this.WAREHOUSES_PROD.unit_id?.toString() || '';
        this.quantity_warehouse = this.WAREHOUSES_PROD.stock || 0;
      } else if (this.WAREHOUSES_PROD.warehouse) {
        // Estructura con objeto warehouse
        this.almacen_warehouse = this.WAREHOUSES_PROD.warehouse?.id?.toString() || '';
        this.quantity_warehouse = this.WAREHOUSES_PROD.quantity || 0;
        
        if (this.WAREHOUSES_PROD.unit && Array.isArray(this.WAREHOUSES_PROD.unit) && this.WAREHOUSES_PROD.unit.length > 0) {
          this.unit_warehouse = this.WAREHOUSES_PROD.unit[0]?.id?.toString() || '';
        }
      }
      
      console.log("Valores cargados - almacén:", this.almacen_warehouse, "unidad:", this.unit_warehouse, "cantidad:", this.quantity_warehouse);
    }
  }

  isLoadingProcess() {
    this.productWarehouseService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productWarehouseService.isLoadingSubject.next(false);
    }, 50);
  }

  getWarehouseDisplayName(): string {
    if (this.WAREHOUSES_PROD?.warehouse?.name) {
      return this.WAREHOUSES_PROD.warehouse.name;
    }
    
    if (this.WAREHOUSES_PROD?.pivot?.warehouse_id && this.WAREHOUSES) {
      const warehouse = this.WAREHOUSES.find(w => w.id == this.WAREHOUSES_PROD.pivot.warehouse_id);
      if (warehouse) return warehouse.name;
    }
    
    if (this.almacen_warehouse && this.WAREHOUSES) {
      const warehouse = this.WAREHOUSES.find(w => w.id == this.almacen_warehouse);
      if (warehouse) return warehouse.name;
    }
    
    return "Producto en Almacén";
  }

  store() {
    if(!this.almacen_warehouse || !this.unit_warehouse || !this.quantity_warehouse) {
      this.toast.error("VALIDACIÓN", "Necesitas seleccionar un almacén, una unidad y colocar la cantidad");
      return;
    }

    const warehouseProductId = this.PRODUCT_WAREHOUSE_ID || this.WAREHOUSES_PROD?.id;

    console.log("PRODUCT_WAREHOUSE_ID recibido:", this.PRODUCT_WAREHOUSE_ID);
    console.log("WAREHOUSES_PROD.id:", this.WAREHOUSES_PROD?.id);
    console.log("ID a usar para actualizar:", warehouseProductId);
    
    if (!warehouseProductId) {
      console.error("ID del warehouse product no está definido");
      this.toast.error("ERROR", "Error: ID del producto-almacén no disponible");
      return;
    }

    if (!this.PRODUCT_ID) {
      console.error("PRODUCT_ID no está definido");
      this.toast.error("ERROR", "Error: ID del producto no disponible");
      return;
    }

    const data = {
      unit_id: this.unit_warehouse,
      warehouse_id: this.almacen_warehouse,
      stock: this.quantity_warehouse,
      product_id: this.PRODUCT_ID
    };

    console.log("Actualizando warehouse product ID:", warehouseProductId);
    console.log("Data a enviar:", data);

    this.productWarehouseService.updateProductWarehouse(warehouseProductId, data).subscribe({
      next: (resp: any) => {
        console.log("Respuesta actualización:", resp);
        
        const updatedWarehouse = {
          id: warehouseProductId,
          unit: this.UNITS.find(u => u.id == this.unit_warehouse),
          warehouse: this.WAREHOUSES.find(w => w.id == this.almacen_warehouse),
          quantity: this.quantity_warehouse,
          pivot: {
            warehouse_id: this.almacen_warehouse,
            unit_id: this.unit_warehouse,
            stock: this.quantity_warehouse,
            product_id: this.PRODUCT_ID
          }
        };

        this.WarehouseE.emit(updatedWarehouse);
        this.toast.success("ÉXITO", "Almacén actualizado correctamente");
        this.modal.dismiss();
      },
      error: (error) => {
        console.error("Error al actualizar:", error);
        this.toast.error("ERROR", "No se pudo actualizar el almacén: " + (error.error?.message || error.message));
      }
    });
    this.isLoadingProcess();
  }
}