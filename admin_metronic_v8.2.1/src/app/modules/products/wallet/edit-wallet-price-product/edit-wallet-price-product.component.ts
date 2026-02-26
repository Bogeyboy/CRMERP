import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ProductWalletsService } from '../../service/product-wallets.service';

@Component({
  selector: 'app-edit-wallet-price-product',
  //imports: [],
  templateUrl: './edit-wallet-price-product.component.html',
  styleUrls: ['./edit-wallet-price-product.component.scss']
})
export class EditWalletPriceProductComponent {
  @Input() WALLETS_PROD: any;
  @Input() UNITS: any = [];
  @Input() SUCURSALES: any = [];
  @Input() CLIENT_SEGMENTS: any = [];

  @Input() PRODUCT_WAREHOUSE_ID: string; // NUEVO INPUT
  @Input() PRODUCT_ID: string; // ✅ Recibir PRODUCT_ID del padre

  @Output() WalletE = new EventEmitter<any>();

  isLoading:any;


  isLoading$:any;

  /* unit_price_multiple:string ='';
  sucursale_price_multiple:string ='';
  client_segment_price_multiple:string ='';
  quantity_price_multiple = 0; */

  unit_price_multiple = '';
  sucursale_price_multiple = '';
  client_segment_price_multiple  = '';
  quantity_price_multiple = 0;

  //ProductWarehousesService: any;

  constructor(
      public modal:NgbActiveModal,
      private http: HttpClient,
      public authservice: AuthService,
      public productWalletService: ProductWalletsService,
      public toast: ToastrService,
    )
  {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    if (this.WALLETS_PROD) {
      /* this.almacen_warehouse = this.WALLETS_PROD.warehouse?.id?.toString() || '';
      this.unit_warehouse = this.WALLETS_PROD.unit?.id?.toString() || '';
      this.quantity_warehouse = this.WALLETS_PROD.quantity || 0; */
      this.unit_price_multiple = this.WALLETS_PROD.unit.id;
      this.sucursale_price_multiple = this.WALLETS_PROD.sucursale ? this.WALLETS_PROD.sucursale.id : '';
      this.client_segment_price_multiple = this.WALLETS_PROD.client_segment ? this.WALLETS_PROD.client_segment.id : '';
      this.quantity_price_multiple = this.WALLETS_PROD.price_general;
    }
}

  isLoadingProcess(){
    this.productWalletService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productWalletService.isLoadingSubject.next(false);
    }, 50);
  }
  //Función para guardar los permisos

  store() {
    /* if(!this.almacen_warehouse || !this.unit_warehouse || !this.quantity_warehouse) {
      this.toast.error("VALIDACIÓN", "Necesitas seleccionar un almacén, una unidad y colocar la cantidad");
      return;
    } */

    // Verificar que tenemos el PRODUCT_ID
    if (!this.PRODUCT_ID) {
      console.error("PRODUCT_ID no está definido");
      this.toast.error("ERROR", "Error: ID del producto no disponible");
      return;
    }

    const data = {
      /* unit_id: this.unit_price_multiple,
      warehouse_id: this.sucursale_price_multiple,
      stock: this.quantity_price_multiple, // Cambiado a 'stock' para coincidir con backend
      product_id: this.PRODUCT_ID */
      product_id: this.PRODUCT_ID,
      unit_id: this.unit_price_multiple,
      client_segment_id : this.client_segment_price_multiple || null,
      sucursal_id: this.sucursale_price_multiple || null,
      price_general: this.quantity_price_multiple
    };

    console.log("Data a enviar para actualización:", data);

    this.productWalletService.updateProductWallet(this.WALLETS_PROD.id, data).subscribe({
      next: (resp: any) => {
        console.log("Respuesta actualización:", resp);

        // Crear objeto actualizado
        const updateWallet = {
          id: this.WALLETS_PROD.id,
          unit: this.UNITS.find(u => u.id == this.unit_price_multiple),

          sucursale: this.sucursale_price_multiple ?
                      this.SUCURSALES.find((s: any) =>
                        s.id == this.sucursale_price_multiple) : null,

          client_segment: this.client_segment_price_multiple ?
                      this.CLIENT_SEGMENTS.find((cs: any) =>
                        cs.id == this.client_segment_price_multiple) : null,

          price_general: this.quantity_price_multiple,
          unit_id: this.unit_price_multiple,
          sucursale_id: this.sucursale_price_multiple || null,
          client_segment_id: this.client_segment_price_multiple || null
        };

        console.log("Enviando al padre:", updateWallet);
        this.WalletE.emit(updateWallet);
        this.toast.success("ÉXITO", "Precio actualizado correctamente");
        this.modal.dismiss();
      },
      error: (error) => {
        console.error("Error al actualizar:", error);
        this.toast.error("ERROR", "No se pudo actualizar el precio");
      }
    });
    this.isLoadingProcess();
  }
}
