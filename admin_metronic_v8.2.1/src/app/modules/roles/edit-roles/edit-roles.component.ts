/* import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SIDEBAR } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { RolesService } from '../service/roles.service';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss']
})
export class EditRolesComponent implements OnInit {
//Definimos este ouput para que se actualice la lista de roles en la vista de list-roles
  //enviando datos desde el componente hijo al padre
  @Output() RoleE = new EventEmitter<any>();

  //recibiendo datos del componente padre
  @Input() ROL_SELECTED:any;

  //Variables
  name ='';
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
    this.name = this.ROL_SELECTED.name;
    this.permissions = this.ROL_SELECTED.permission_pluck;
  }
  //Función para añadir permisos
  addPermission(permiso:string)
  {
    const INDEX = this.permissions.findIndex((perm:string) => perm == permiso);
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

    const data = {
      name: this.name,
      permissions: this.permissions,
    }

    this.rolesService.updateRol(this.ROL_SELECTED.id, data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Rol editado correctamente");
        this.RoleE.emit(resp.rol);
        this.modal.close();
      }
    });
  }
}

 */
// edit-roles.component.ts - VERSIÓN COMPLETA Y CORREGIDA
// edit-roles.component.ts - CON TIPIFICACIONES CORRECTAS
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from '../service/roles.service';

// Definir la interfaz para los permisos
interface Permission {
  id?: number;
  name: string;
  guard_name?: string;
}

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss']
})
export class EditRolesComponent implements OnInit {
  @Output() RoleE = new EventEmitter<any>();
  @Input() ROL_SELECTED: any;

  name = '';
  isLoading$: any;
  allPermissions: Permission[] = [];      // ← Tipado como array de Permission
  permissions: string[] = [];             // ← Tipado como array de strings
  groupedPermissions: { [key: string]: Permission[] } = {};  // ← Tipado correcto

  constructor(
    public modal: NgbActiveModal,
    public rolesService: RolesService,
    public toast: ToastrService,
  ) {
    this.isLoading$ = this.rolesService.isLoading$;
  }

  ngOnInit(): void {
    this.name = this.ROL_SELECTED.name;
    this.permissions = this.ROL_SELECTED.permission_pluck || [];

    // Cargar permisos desde el backend
    this.loadAllPermissions();
  }

  // Obtener permisos de la BD
  loadAllPermissions() {
    this.rolesService.getAllPermissions().subscribe({
      next: (resp: any) => {
        this.allPermissions = resp.permissions;
        this.groupPermissionsByCategory();
        console.log('Permisos cargados:', this.allPermissions.length);
        console.log('Categorías:', Object.keys(this.groupedPermissions));
      },
      error: (error) => {
        console.error('Error cargando permisos:', error);
        this.toast.error('Error', 'No se pudieron cargar los permisos');
      }
    });
  }

  // Agrupar permisos por categoría
  groupPermissionsByCategory() {
    // Reiniciar el objeto
    this.groupedPermissions = {};

    this.allPermissions.forEach((permiso: Permission) => {
      // Extraer categoría del nombre del permiso
      // Ej: 'list_role' → 'role', 'register_product' → 'product'
      const parts = permiso.name.split('_');
      let category = '';

      if (parts.length >= 2) {
        // Tomar la segunda parte y las siguientes
        category = parts.slice(1).join('_');
      } else {
        category = parts[0];
      }

      // Capitalizar primera letra
      category = category.charAt(0).toUpperCase() + category.slice(1);

      if (!this.groupedPermissions[category]) {
        this.groupedPermissions[category] = [];
      }
      this.groupedPermissions[category].push(permiso);
    });
  }

  addPermission(permiso: string) {
    const index = this.permissions.findIndex(p => p === permiso);
    if (index !== -1) {
      this.permissions.splice(index, 1);
    } else {
      this.permissions.push(permiso);
    }
    console.log('Permisos seleccionados:', this.permissions);
  }

  store() {
    if (!this.name) {
      this.toast.error('Validación', 'El nombre es requerido');
      return;
    }

    if (this.permissions.length === 0) {
      this.toast.error('Validación', 'Selecciona al menos un permiso');
      return;
    }

    const data = {
      name: this.name,
      permissions: this.permissions
    };

    this.rolesService.updateRol(this.ROL_SELECTED.id, data).subscribe({
      next: (resp: any) => {
        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Éxito', 'Rol editado correctamente');
          this.RoleE.emit(resp.rol);
          this.modal.close();
        }
      },
      error: (error) => {
        console.error('Error al actualizar rol:', error);
        this.toast.error('Error', 'No se pudo actualizar el rol');
      }
    });
  }
}
