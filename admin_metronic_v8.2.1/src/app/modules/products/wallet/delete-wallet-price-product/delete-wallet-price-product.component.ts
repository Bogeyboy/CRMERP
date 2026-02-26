import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ProductWalletsService } from '../../service/product-wallets.service';

@Component({
  selector: 'app-delete-wallet-price-product',
  //imports: [],
  templateUrl: './delete-wallet-price-product.component.html',
  styleUrls: ['./delete-wallet-price-product.component.scss']
})
export class DeleteWalletPriceProductComponent {
  @Output() WalletD = new EventEmitter<any>();
  //recibiendo datos del componente padre
  @Input() WALLETS_PROD:any;

  //Variables
  isLoading:any;

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
  }
  //Función para guardar los permisos
  delete()
  {

    this.productWalletService.deleteProductWallet(this.WALLETS_PROD.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","El precio del producto se eliminó correctamente.");
        this.WalletD.emit(resp.message);
        this.modal.close();
      }
    });
  }
}
