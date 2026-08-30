import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth';
import { ProductsService } from '../../../products/service/products.service';

@Component({
  selector: 'app-delete-product-detail-proforma',
  standalone: true,
  imports: [],
  templateUrl: './delete-product-detail-proforma.component.html',
  styleUrl: './delete-product-detail-proforma.component.scss'
})
export class DeleteProductDetailProformaComponent {
  @Output() DeleteProductProforma = new EventEmitter<any>();
  //recibiendo datos del componente padre
  @Input() DETAIL_PRODUCT:any;

  //Variables
  isLoading:any;

  modal = inject(NgbActiveModal);
  private http = inject(HttpClient);
  authservice = inject(AuthService);
  toast = inject(ToastrService);

  ngOnInit(): void {
  }
  //Función para guardar los permisos
  delete()
  {
    this.DeleteProductProforma.emit('');
    this.modal.close();
  }
}
