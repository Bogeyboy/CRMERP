import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-delete-product',
  //imports: [],
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent {
  @Output() ProductsD = new EventEmitter<any>();
  //recibiendo datos del componente padre
  @Input() PRODUCT_SELECTED:any;

  //Variables
  isLoading:any;

  modal = inject(NgbActiveModal);
  private http = inject(HttpClient);
  authservice = inject(AuthService);
  productsService = inject(ProductsService);
  toast = inject(ToastrService);

  ngOnInit(): void {
  }
  //Función para guardar los permisos
  delete()
  {

    this.productsService.deleteProduct(this.PRODUCT_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Producto eliminado correctamente");
        this.ProductsD.emit(resp.message);
        this.modal.close();
      }
    });
  }
}
