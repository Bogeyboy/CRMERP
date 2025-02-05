import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { SIDEBAR } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { RolesService } from '../service/roles.service';

@Component({
  selector: 'app-delete-roles',
  templateUrl: './delete-roles.component.html',
  styleUrls: ['./delete-roles.component.scss']
})
export class DeleteRolesComponent {
    @Output() RoleD:EventEmitter<any> = new EventEmitter();
  
    //recibiendo datos del componente padre
    @Input() ROL_SELECTED:any;
  
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
    }
    //Función para guardar los permisos
    delete()
    {
      
      this.rolesService.deleteRol(this.ROL_SELECTED.id).subscribe((resp:any) => {
        console.log(resp);
        if(resp.message == 403)
        {
          this.toast.error("Validación",resp.message_text);
        }
        else
        {
          this.toast.success("Éxito","Rol eliminado correctamente");
          this.RoleD.emit(resp.rol);
          this.modal.close();
        }
      });
    }
}
