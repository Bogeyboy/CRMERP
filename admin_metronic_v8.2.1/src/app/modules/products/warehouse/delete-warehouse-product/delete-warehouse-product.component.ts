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
  delete()
  {

    this.productWarehouseService.deleteProductWarehouse(this.WAREHOUSES_PROD.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","La existencia del producto se eliminó correctamente.");
        this.WarehouseD.emit(resp.message);
        this.modal.close();
      }
    });
  }
}
