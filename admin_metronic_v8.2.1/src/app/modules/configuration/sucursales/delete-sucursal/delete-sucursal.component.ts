import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SucursalService } from '../service/sucursal.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-delete-sucursal',
  //imports: [],
  templateUrl: './delete-sucursal.component.html',
  styleUrls: ['./delete-sucursal.component.scss']
})
export class DeleteSucursalComponent {

    @Output() SucursalD:EventEmitter<any> = new EventEmitter();
    //recibiendo datos del componente padre
    @Input() SUCURSAL_SELECTED:any;
  
    //Variables
    isLoading:any;

    constructor(
        public modal:NgbActiveModal,
        private http: HttpClient,
        public authservice: AuthService,
        public sucursalesService: SucursalService,
        public toast: ToastrService,
      )
    {
      
    }
  
    ngOnInit(): void {
    }
    //Función para guardar los permisos
    delete()
    {
      
      this.sucursalesService.deleteSucursal(this.SUCURSAL_SELECTED.id).subscribe((resp:any) => {
        console.log(resp);
        if(resp.message == 403)
        {
          this.toast.error("Validación",resp.message_text);
        }
        else
        {
          this.toast.success("Éxito","Sucursal eliminada correctamente");
          this.SucursalD.emit(resp.message);
          this.modal.close();
        }
      });
    }
}
