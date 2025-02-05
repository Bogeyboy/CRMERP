import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SIDEBAR } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { RolesService } from '../service/roles.service';

@Component({
  selector: 'app-create-roles',
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss']
})
export class CreateRolesComponent {

  //Definimos este ouput para que se actualice la lista de roles en la vista de list-roles
  //enviando datos desde el componente hijo al padre
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
