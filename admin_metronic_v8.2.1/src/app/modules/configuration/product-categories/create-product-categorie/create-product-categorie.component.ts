import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ProductCategoriesService } from '../service/product-categories.service';

@Component({
  selector: 'app-create-product-categorie',
  //imports: [],
  templateUrl: './create-product-categorie.component.html',
  styleUrls: ['./create-product-categorie.component.scss']
})
export class CreateProductCategorieComponent {
  @Output() ProductCategorieC:EventEmitter<any> = new EventEmitter();
    
    //Variables
    name: string ='';
    address: string = '';
    imagen: string = '';
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
    {}
  
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      
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
          this.toast.error("Validación","La categoría de producto ya existe.");
          return false;
        }

        if(!this.IMAGEN_CATEGORIE)
        {
          this.toast.error("Validación","La imagen de la categoría de producto es requerida.");
          return false;
        }

        let formData = new FormData();
        formData.append('name',this.name);
        formData.append('categorie_imagen',this.IMAGEN_CATEGORIE);//categorie_imagen es el nombre del campo que espera el servidor
        
        this.productCategorieService.registerProductCategorie(formData).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Categoría de producto añadida.");
            this.ProductCategorieC.emit(resp.categorie);
            this.modal.close();
          }
        });
    }
}
