import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  @Output() UserE = new EventEmitter<any>();
  //@Input() roles:any = [];

  roles: any[] = [];

  @Input() USER_SELECTED:any;

  isLoading:any;

  name = '';
  surname = '';
  email = '';
  phone = '';
  rol_id = '';
  gender = '';
  type_document = 'DNI';
  document = '';
  address = '';

  file_name:any;
  imagen_previzualiza:any;

  password = '';
  password_repit = '';

  loadingRoles: boolean;
  errorLoadingRoles: boolean;
  errorMessage:string;

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

    this.loadRoles();
  }

  loadRoles(): void {
    this.loadingRoles = true;
    this.errorLoadingRoles = false;
    this.errorMessage = '';

    console.log('🔄 Cargando roles...');

    this.usersService.getRoles().subscribe({
      next: (roles: any) => {
        console.log('✅ Roles recibidos:', roles);

        if (Array.isArray(roles) && roles.length > 0) {
          this.roles = roles;
          console.log(`📊 ${roles.length} roles cargados`);
        } else {
          this.errorLoadingRoles = true;
          this.errorMessage = 'No se encontraron roles disponibles';
          console.warn('⚠️ No hay roles disponibles');
        }
      },
      error: (err) => {
        console.error('❌ Error cargando roles:', err);
        this.errorLoadingRoles = true;

        if (err.status === 403) {
          this.errorMessage = 'No tienes permisos para ver los roles';
          this.toast.error('Permiso denegado', this.errorMessage);
        } else if (err.status === 404) {
          // Intentar con /users/config como fallback
          this.fallbackToConfigAll();
        } else {
          this.errorMessage = 'Error al cargar los roles';
          this.toast.error('Error', this.errorMessage);
        }
      },
      complete: () => {
        this.loadingRoles = false;
        console.log('🏁 Carga de roles completada');
      }
    });
  }

fallbackToConfigAll(): void {
    console.log('🔄 Intentando fallback con configAll...');
    this.usersService.configAll().subscribe({
      next: (resp: any) => {
        console.log('📦 Respuesta de configAll:', resp);
        if (resp && resp.roles) {
          this.roles = resp.roles;
          console.log(`📊 ${resp.roles.length} roles cargados desde configAll`);
        } else {
          this.errorMessage = 'No se encontraron roles disponibles';
          this.toast.warning('Advertencia', this.errorMessage);
        }
      },
      error: (err) => {
        console.error('❌ Error en fallback:', err);
        this.errorMessage = 'No se pudieron cargar los roles';
        this.toast.error('Error', this.errorMessage);
      }
    });
  }

  //Se procesa la imagen que se va a enviar
  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toast.warning("WARN","El archivo no es una imagen");
      return;
    }
    this.file_name = $event.target.files[0];
    const reader = new FileReader();
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

    const formData = new FormData();
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
