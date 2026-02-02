import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../service/users.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  @Output() UserC = new EventEmitter<any>();
  //@Input() roles:any = [];

  roles: any[] = [];

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
    this.loadRoles();
  }

  //Cargamos los roles disponibles
  /* loadRoles(): void {
    this.loadingRoles = true;
    this.usersService.configAll().pipe(
      finalize(() => this.loadingRoles = false)
    ).subscribe({
      next: (resp: any) => {
        // Asumiendo que configAll() devuelve los roles en alguna propiedad
        // Ajusta según la estructura real de tu respuesta
        if (resp && resp.roles)
        {
          this.roles = resp.roles;
        }
        else if (resp && Array.isArray(resp))
        {
          console.log('Respuesta de roles es un array directamente:', resp);
          this.roles = resp; // Si la respuesta es directamente el array
        }
        console.log('Roles cargados en modal:', this.roles);
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.toast.error('Error', 'No se pudieron cargar los roles');
      }
    });
  } */

  /* loadRoles(): void {
    this.loadingRoles = true;
    this.errorLoadingRoles = false;
    this.errorMessage = '';

    this.usersService.getRoles().subscribe({
      next: (roles: any) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        // Si falla, intenta con configAll como fallback
        this.usersService.configAll().subscribe({
          next: (resp: any) => {
            if (resp && resp.roles) {
              this.roles = resp.roles;
            }
          },
          error: () => {
            this.toast.error('Error', 'No se pudieron cargar los roles');
          }
        });
      },
      complete: () => {
        this.loadingRoles = false;
      }
    });
  } */

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

  //Prtocesamos el archivo que queremos subir al servidor
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
   const formData = new FormData();
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
