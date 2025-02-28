import { Component } from '@angular/core';

@Component({
  selector: 'app-create-sucursal',
  //imports: [],
  templateUrl: './create-sucursal.component.html',
  styleUrls: ['./create-sucursal.component.scss']
})
export class CreateSucursalComponent {

  @Output() RoleC:EventEmitter<any> = new EventEmitter();
  
    //Variables
    name: string ='';
    isLoading:any;
    SIDEBAR:any = SIDEBAR;
    permissions:any = [];
  
    constructor(
        public modal:NgbActiveModal,
        private http: HttpClient,
        public authservice: AuthService,
        public rolesService: RolesService,
        public toast: ToastrService,
      )
    {
      
    }
  
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      
    }
    //Función para añadir permisos
    addPermission(permiso:string)
    {
      let INDEX = this.permissions.findIndex((perm:string) => perm == permiso);
      // Si encuentra una coincidencia, elimina el permiso, si no la encuentra lo añade
      if (INDEX != -1) {
        this.permissions.splice(INDEX,1);
      }
      else
      {
        this.permissions.push(permiso);
      }
      console.log(this.permissions);
    }
    //Función para guardar los permisos
    store()
    {
      if(!this.name)
      {
        this.toast.error("Validación","El nombre es requerido");
        return false;
      }
  
      if(this.permissions.length == 0)
      {
        this.toast.error("Validación","Hay que seleccionar algún permiso para añadir");
        return false;
      }
      
      let data = {
        name: this.name,
        permissions: this.permissions,
      }
  
      this.rolesService.registerRole(data).subscribe((resp:any) => {
        console.log(resp);
        if(resp.message == 403)
        {
          this.toast.error("Validación",resp.message_text);
        }
        else
        {
          this.toast.success("Éxito","Rol registrado correctamente");
          this.RoleC.emit(resp.rol);
          this.modal.close();
        }
      });
    }
}
