import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductCategoriesService } from '../service/product-categories.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-edit-product-categorie',
  //imports: [],
  templateUrl: './edit-product-categorie.component.html',
  styleUrls: ['./edit-product-categorie.component.scss']
})
export class EditProductCategorieComponent {
  @Output() ProductCategorieE:EventEmitter<any> = new EventEmitter();
  @Input() CATEGORIE_SELECTED:any;
    
    //Variables
    name: string ='';
    state: number = 1;
    IMAGEN_CATEGORIE:any;
    IMAGEN_PREVISUALIZA: any;
    isLoading:any;
  
    constructor(
        public modal:NgbActiveModal,
        private http: HttpClient,
        public authservice: AuthService,
        public productCategorieService: ProductCategoriesService,
        public toast: ToastrService,
      )
    {
      
    }
  
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.name = this.CATEGORIE_SELECTED.name;
      this.state = this.CATEGORIE_SELECTED.state;
      this.IMAGEN_PREVISUALIZA = this.CATEGORIE_SELECTED.imagen;
    }
    //Prtocesamos el archivo que queremos subir al servidor
    processFile($event:any){
      if($event.target.files[0].type.indexOf("image") < 0){
        this.toast.warning("WARN","El archivo no es una imagen");
        return;
      }
      this.IMAGEN_CATEGORIE = $event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.IMAGEN_CATEGORIE);
      reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    }
    store()
    {
      if(!this.name)
      {
        this.toast.error("Validación","La categoría de producto ya existe");
        return false;
      }
      let formData = new FormData();
      formData.append('name',this.name);
      if (this.IMAGEN_CATEGORIE)
      {
        formData.append('categorie_imagen',this.IMAGEN_CATEGORIE);//categorie_imagen es el nombre del campo que espera el servidor
      }
      formData.append('state',this.state+"");
      
      this.productCategorieService.updateProductCategorie(this.CATEGORIE_SELECTED.id, formData).subscribe((resp:any) => {
        console.log(resp);
        if(resp.message == 403)
        {
          this.toast.error("Validación",resp.message_text);
        }
        else
        {
          this.toast.success("Éxito","Categoría de producto añadida.");
          this.ProductCategorieE.emit(resp.categorie);
          this.modal.close();
        }
      });
    }
}
