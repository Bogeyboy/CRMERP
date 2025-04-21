import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductCategoriesService } from '../service/product-categories.service';

@Component({
  selector: 'app-delete-product-categorie',
  //imports: [],
  templateUrl: './delete-product-categorie.component.html',
  styleUrls: ['./delete-product-categorie.component.scss']
})
export class DeleteProductCategorieComponent {
  @Output() ProductCategorieD: EventEmitter<any> = new EventEmitter();
  @Input()  CATEGORIE_SELECTED:any;

  name:string = '';
  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public productCategorieService: ProductCategoriesService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
  }

  delete(){
    
    this.productCategorieService.deleteProductCategorie(this.CATEGORIE_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La categoria de producto se eliminó correctamente.");
        this.ProductCategorieD.emit(resp.categorie);
        this.modal.close();
      }
    })
  }
}
