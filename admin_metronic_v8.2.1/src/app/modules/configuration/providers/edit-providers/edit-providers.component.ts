import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { ProvidersService } from '../service/providers.service';

@Component({
  selector: 'app-edit-providers',
  //imports: [],
  templateUrl: './edit-providers.component.html',
  styleUrls: ['./edit-providers.component.scss']
})
export class EditProvidersComponent {
  @Output() ProviderE:EventEmitter<any> = new EventEmitter();
  @Input() PROVIDER_SELECTED:any;
    
    //Variables
    full_name: string ='';
    comercial_name: string ='';
    nif: string ='';
    email: string ='';
    phone: string ='';
    address: string = '';
    state: number = 1;

    imagen: string = '';
    IMAGEN_PROVIDER:any;
    IMAGEN_PREVISUALIZA: any;
    isLoading:any;
  
    constructor(
        public modal:NgbActiveModal,
        private http: HttpClient,
        public authservice: AuthService,
        public providerService: ProvidersService,
        public toast: ToastrService,
      )
    {
      
    }
  
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.full_name = this.PROVIDER_SELECTED.full_name;
      this.comercial_name = this.PROVIDER_SELECTED.comercial_name;
      this.nif = this.PROVIDER_SELECTED.nif;
      this.email = this.PROVIDER_SELECTED.email;
      this.phone = this.PROVIDER_SELECTED.phone;
      this.address = this.PROVIDER_SELECTED.address;
      this.state = this.PROVIDER_SELECTED.state;
      this.IMAGEN_PREVISUALIZA = this.PROVIDER_SELECTED.imagen;
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
      if(!this.full_name)
      {
        this.toast.error("Validación","Ya existe un proveedor con esa razón social.");
        return false;
      }
      if(!this.nif)
      {
        this.toast.error("Validación","El NIF de proveedor ya existe.");
        return false;
      }
      let formData = new FormData();
      formData.append('full_name',this.full_name);
      formData.append('comercial_name',this.comercial_name);
      formData.append('nif',this.nif);
      formData.append('email',this.email);
      formData.append('phone',this.phone);
      formData.append('address',this.address);
      if (this.IMAGEN_PROVIDER)
      {
        formData.append('provider_imagen',this.IMAGEN_PROVIDER);//provider_imagen es el nombre del campo que espera el servidor
      }
      formData.append('state',this.state+"");
      
      this.providerService.updateProvider(this.PROVIDER_SELECTED.id, formData).subscribe((resp:any) => {
        //console.log(resp);
        if(resp.message == 403)
        {
          this.toast.error("Validación",resp.message_text);
        }
        else
        {
          this.toast.success("Éxito","Proveedor editado correctamente.");
          this.ProviderE.emit(resp.provider);
          this.modal.close();
        }
      });
    }
}
