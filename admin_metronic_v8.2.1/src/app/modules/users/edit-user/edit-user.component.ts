import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {

  @Output() UserE: EventEmitter<any> = new EventEmitter();
  @Input() roles:any = [];
  @Input() USER_SELECTED:any;

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
    this.name = this.USER_SELECTED.name
    this.surname = this.USER_SELECTED.surname
    this.email = this.USER_SELECTED.email
    this.phone = this.USER_SELECTED.phone
    this.rol_id = this.USER_SELECTED.rol_id
    this.gender = this.USER_SELECTED.gender
    this.type_document = this.USER_SELECTED.type_document
    this.document = this.USER_SELECTED.document
    this.address = this.USER_SELECTED.address
    this.imagen_previzualiza = this.USER_SELECTED.avatar
  }
  //Se procesa la imagen que se va a enviar
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
    //Validación del nombre
    if(!this.name){
      this.toast.error("Validación","El nombre es requerido");
      return false;
    }
    //Validación del tipo y número de documento
    if((!this.type_document || !this.document)){
      this.toast.error("Validación","El tipo y número de documento son requeridos");
      return false;
    }
    //Validación del número de teléfono
    if(!this.phone){
      this.toast.error("Validación","El teléfono es requerido");
      return false;
    }
    //Validación del género
    if(!this.gender){
      this.toast.error("Validación","El género es requerido");
      return false;
    }
    //Validación del ROL
    if(!this.rol_id){
      this.toast.error("Validación","El rol es requerido");
      return false;
    }
    //Validación de igualdad de las contraseñas en caso de que se vayan a cambiar
    if(this.password && this.password != this.password_repit){
      this.toast.error("Validación","La contraseña no son iguales");
      return false;
    }

    let formData = new FormData();
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("phone",this.phone);
    formData.append("rol_id",this.rol_id);
    formData.append("gender",this.gender);
    formData.append("type_document",this.type_document);
    formData.append("document",this.document);
    formData.append('_method','PUT');//Se envía el método PUT para poder actuar con las fotos
    
    if(this.address){
      formData.append("address",this.address);
    }

    if(this.password){
      formData.append("password",this.password);
    }
    if(this.file_name){
      formData.append("imagen",this.file_name);
    }
    
    this.usersService.updateUser(this.USER_SELECTED.id,formData).subscribe((resp:any) => {
      //console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El usuario se ha editado correctamente");
        this.UserE.emit(resp.user);
        this.modal.close();
      }
    })
  }
}