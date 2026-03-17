// create-product-categorie.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ProductCategoriesService } from '../service/product-categories.service';

@Component({
  selector: 'app-create-product-categorie',
  templateUrl: './create-product-categorie.component.html',
  styleUrls: ['./create-product-categorie.component.scss']
})
export class CreateProductCategorieComponent implements OnInit {
  @Output() ProductCategorieC = new EventEmitter<any>();
    
    //Variables
    name = '';
    address = '';
    imagen = '';
    IMAGEN_CATEGORIE: any = null;
    IMAGEN_PREVISUALIZA: any = null;
    isLoading: boolean = false;
  
    constructor(
        public modal: NgbActiveModal,
        private http: HttpClient,
        public authservice: AuthService,
        public productCategorieService: ProductCategoriesService,
        public toast: ToastrService,
    ) {}
  
    ngOnInit(): void {}
    
    processFile($event: any) {
      const file = $event.target.files[0];
      if (!file) return;
      
      if (file.type.indexOf("image") < 0) {
        this.toast.warning("WARN", "El archivo no es una imagen");
        return;
      }
      
      this.IMAGEN_CATEGORIE = file;
      const reader = new FileReader();
      reader.readAsDataURL(this.IMAGEN_CATEGORIE);
      reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    }

    debugFormData(formData: FormData): void {
      console.log('=== 📦 CONTENIDO FORM DATA ===');
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}:`, `Archivo: ${value.name}, Tipo: ${value.type}, Tamaño: ${value.size} bytes`);
        } else {
          console.log(`${key}:`, value);
        }
      });
      console.log('===============================');
    }

    store() {
      // Validaciones
      if (!this.name) {
        this.toast.error("Validación", "El nombre de la categoría es requerido.");
        return false;
      }

      if (!this.IMAGEN_CATEGORIE) {
        this.toast.error("Validación", "La imagen de la categoría de producto es requerida.");
        return false;
      }

      this.isLoading = true;

      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('categorie_imagen', this.IMAGEN_CATEGORIE);

      // Depurar FormData
      this.debugFormData(formData);

      // Usar el servicio
      this.productCategorieService.registerProductCategorie(formData).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          console.log('✅ Respuesta exitosa:', resp);
          
          if (resp.message == 403) {
            this.toast.error("Validación", resp.message_text);
          } else {
            this.toast.success("Éxito", "Categoría de producto añadida.");
            this.ProductCategorieC.emit(resp.categorie || resp.data);
            this.modal.close();
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('❌ Error completo:', error);
          console.error('Status:', error.status);
          console.error('Error response:', error.error);
          
          if (error.status === 422) {
            const errors = error.error?.errors;
            if (errors) {
              Object.keys(errors).forEach(key => {
                this.toast.error("Validación", `${key}: ${errors[key][0]}`);
              });
            } else {
              this.toast.error("Error de validación", "Verifica los datos");
            }
          } else if (error.status === 401) {
            this.toast.error("No autorizado", "Inicia sesión nuevamente");
          } else if (error.status === 500) {
            this.toast.error("Error del servidor", error.error?.message || "Error interno");
          } else {
            this.toast.error("Error", error.error?.message || "Error al guardar");
          }
        }
        
      });
      this.isLoadingProcess();
    }
    isLoadingProcess(){
      this.productCategorieService.isLoadingSubject.next(true);
      setTimeout(() => {
        this.productCategorieService.isLoadingSubject.next(false);
      }, 50);
  }
}