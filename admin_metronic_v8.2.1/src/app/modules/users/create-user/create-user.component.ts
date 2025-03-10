import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {

  @Output() UserC: EventEmitter<any> = new EventEmitter();
  @Input() roles:any = [];

  isLoading:any;
  
  name:string = '';
  surname:string = '';
  email:string = '';
  phone:string = '';
  rol_id:string = '';
  gender:string = '';
  type_document:string = 'DNI';
  document:string = '';
  address:string = '';

  file_name:any;
  imagen_previzualiza:any;

  password:string = '';
  password_repit:string = '';
  constructor(
    public modal: NgbActiveModal,
    public usersService: UsersService,
    public toast: ToastrService,
  ) {
    
  }

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
    this.file_name = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_name);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
  }
  store(){
    //Validaciones de existencia de campos
    //Validfación de nombre
    if(!this.name){
      this.toast.error("Validación","El nombre del usuario es requerido");
      return false;
    }
    //Validfación de de tipo de documento y número
    if(!this.type_document || !this.document){
      this.toast.error("Validación","El tipo y número de documento son requeridos");
      return false;
    }
    //Validfación de teléfono
    if(!this.phone){
      this.toast.error("Validación","El número es requerido");
      return false;
    }
    //Validación de género
    if(!this.gender){
      this.toast.error("Validación","El género es requerido");
      return false;
    }
    //Validación de rol
    if(!this.rol_id){
      this.toast.error("Validación","El rol es requerido");
      return false;
    }
    //Validación de contraseña
    if(!this.password){
      this.toast.error("Validación","La contraseña es requerida");
      return false;
    }
    //Validación de coincidencia de las contraseñas.
    if(this.password && this.password != this.password_repit){
      this.toast.error("Validación","La contraseñas no son iguales");
      return false;
    }
    //Transformamos los datos antes de enviarlos
   let formData = new FormData();
   formData.append("name",this.name);
   formData.append("surname",this.surname);
   formData.append("email",this.email);
   formData.append("phone",this.phone);
   formData.append("rol_id",this.rol_id);
   formData.append("gender",this.gender);
   formData.append("type_document",this.type_document);
   formData.append("document",this.document);
   if(this.address){
     formData.append("address",this.address);
   }
   
   formData.append("password",this.password);
   //Se llama iimagen porque en el backend se llama imagen
   formData.append("imagen",this.file_name);

    this.usersService.registerUser(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El usuario se ha registro correctamente");
        this.UserC.emit(resp.user);
        this.modal.close();
      }
    })
  }

}
