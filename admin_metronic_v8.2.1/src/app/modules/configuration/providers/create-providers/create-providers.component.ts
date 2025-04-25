import { Component, EventEmitter, Output } from '@angular/core';
import { ProvidersService } from '../service/providers.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-create-providers',
  //imports: [],
  templateUrl: './create-providers.component.html',
  styleUrls: ['./create-providers.component.scss']
})
export class CreateProvidersComponent {
@Output() ProviderC:EventEmitter<any> = new EventEmitter();
    
    //Variables
    full_name: string ='';
    comercial_name: string ='';
    nif: string ='';
    email: string ='';
    phone: string ='';
    address: string = '';

    imagen: string = '';
    IMAGEN_PROVIDER:any;
    IMAGEN_PREVISUALIZA: any;
    isLoading:any;
  
    constructor(
        public modal:NgbActiveModal,
        private http: HttpClient,
        public authservice: AuthService,
        public ProvidersService: ProvidersService,
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
      this.IMAGEN_PROVIDER = $event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.IMAGEN_PROVIDER);
      reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    }

    store()
      {
        let formData = new FormData();
        /* Comprobamos la existencia de la razón social, si no existe la añadimos */
        if(!this.full_name)
        {
          this.toast.error("Validación","La razón social del proveedor ya existe.");
          return false;
        }/* else{
          formData.append('full_name',this.full_name);
        } */
        /* Comprobamos la existencia de un campo de nombre comercial, en caso contrario lo dejamos vacío */
        if(this.comercial_name)
        {
          formData.append('comercial_name',this.comercial_name);
        }else{
          formData.append('comercial_name','');
        }
        /* Comprobamos la existencia del NIF, si no existe lo añadimos */
        if(!this.nif)
        {
          this.toast.error("Validación","El NIF del proveedor ya existe.");
          return false;
        }/* else{
          formData.append('nif',this.nif);
        } */
        /* Comprobamos la existencia de un campo imagen */
        if(this.IMAGEN_PROVIDER)
        {
          formData.append('provider_imagen',this.IMAGEN_PROVIDER);//provider_imagen es el nombre del campo que espera el servidor
        }
        /* Comprobamos la existencia de un campo EMAIL, en caso contrario lo dejamos vacío */
        if(this.email)
        {
          formData.append('email',this.email);
        }else{
          formData.append('email','');
        }
        /* Comprobamos la existencia de un campo de dirección, en caso contrario lo dejamos vacío */
        if(this.address)
        {
          formData.append('address',this.address);
        }else{
          formData.append('address','');
        }
        /* Comprobamos la existencia de un campo teléfono, en caso contrario lo dejamos vacío */
        if(this.phone)
        {
          formData.append('phone',this.phone);
        }else{
          formData.append('phone','');
        }
        formData.append('full_name',this.full_name);
        formData.append('nif',this.nif);
        this.ProvidersService.registerProvider(formData).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Proveedor añadido.");
            this.ProviderC.emit(resp.provider);
            this.modal.close();
          }
        });
    }
}
