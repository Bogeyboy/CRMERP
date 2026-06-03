import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth';
import { ProductsService } from '../service/products.service';
import { data } from 'jquery';

@Component({
  selector: 'app-import-products',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './import-products.component.html',
  styleUrl: './import-products.component.scss'
})
export class ImportProductsComponent {
  @Output() ImportProductD = new EventEmitter<any>();

  //Variables
  name ='';
  address = '';

  isLoading:any;

  file_excell:any;

  constructor(
      public modal:NgbActiveModal,
      private http: HttpClient,
      public authservice: AuthService,
      public productService: ProductsService,
      public toast: ToastrService,
    )
  {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('AuthService completo:', this.authservice);
    console.log('Métodos disponibles:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.authservice)));
    console.log('Token:', this.authservice.getToken());
  }
  processFile($event: any)
  {
    this.file_excell = $event.target.files[0];
    const file = this.file_excell;
    if (file)
    {
      const validExtensions = ['xls', 'xlsx', 'csv', 'ods'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExtension))
      {
        this.toast.error("Validación","El archivo de importación no tiene una extensión válida. Use: ${validExtensions.join(', ')}");
        this.file_excell = null;
        $event.target.value = '';
        return;
      }
    }
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size === 0)
    {
      this.toast.error("Error", "El archivo está vacío");
      this.file_excell = null;
      $event.target.value = '';
      return;
    }

    if (file.size > maxSize)
    {
      this.toast.error("Error", "El archivo no debe exceder los 5MB");
      this.file_excell = null;
      $event.target.value = '';
      return;
    }

    this.file_excell = file;
    this.toast.info("Archivo seleccionado: "+file.name);
  }

  //Función para guardar los permisos
  
  store()
  {
    if (!this.file_excell)
    {
      this.toast.error("Validación", "El archivo de importación es requerido.");
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('import_file', this.file_excell, this.file_excell.name);

    // Agregar headers específicos
    const headers = {
        'Accept': 'application/json',
        // No establecer 'Content-Type' ya que FormData lo hace automáticamente
    };
    console.log(formData.get('import_file'));
    this.productService.importProduct(formData, headers).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        console.log('=== RESPUESTA COMPLETA DEL SERVIDOR ===');
        console.log('Tipo de respuesta:', typeof resp);
        console.log('Respuesta:', resp);
        console.log('resp.message:', resp.message);
        console.log('resp.message === 200:', resp.message === 200);
        console.log('resp.message == 200:', resp.message == 200);
        if (resp.message === 200)
        {
          this.toast.success("Éxito", resp.message_text || "Los productos se han importado correctamente.");
          this.ImportProductD.emit(resp.message);
          this.modal.close();
        }
        else
        {
          //console.log('Entrando en el else - mensaje de error');
          this.toast.error("Error", resp.message_text || "Ha ocurrido un error al importar los productos.");
          if (resp.errors && resp.errors.length > 0)
          {
            console.error('Errores detallados:', resp.errors);
            // Mostrar primeros 5 errores
            const errorSummary = resp.errors.slice(0, 5).join('\n');
            this.toast.warning("Detalles", errorSummary + (resp.errors.length > 5 ? `\n... y ${resp.errors.length - 5} errores más` : ''));
          }
        }
      },
      error: (error) =>
      {
        this.isLoading = false;
        /* console.error('Error al importar productos:', error);
        console.log('=== ERROR EN LA PETICIÓN ===');
        console.log('Error:', error);
        console.log('error.status:', error.status);
        console.log('error.error:', error.error); */

        if (error.status === 422 && error.error?.errors)
        {
          let errorMessage = "Errores de validación:\n";
          const failures = error.error.errors;
          failures.forEach((failure: any) => {
              if (failure.row && failure.errors) {
                      errorMessage += `Fila ${failure.row()}: ${failure.errors().join(', ')}\n`;
                  } else if (typeof failure === 'string') {
                      errorMessage += `${failure}\n`;
                  }
          });
          this.toast.error("Error de validación", errorMessage);
        }
        else if (error.error?.message_text)
        {
          this.toast.error("Error", error.error.message_text);
        }
        else if (error.status === 0)
        {
          this.toast.error("Error", "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
        }
        else
        {
          this.toast.error("Error", "Ha ocurrido un error al importar los productos. Por favor, verifica el formato del archivo e inténtalo de nuevo.");
        }
      }
    });
  }
}
