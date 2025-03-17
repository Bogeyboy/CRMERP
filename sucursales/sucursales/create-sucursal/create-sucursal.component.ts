import { Component, EventEmitter, Output } from '@angular/core';
import { SucursalService } from '../service/sucursal.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-create-sucursal',
  //imports: [],
  templateUrl: './create-sucursal.component.html',
  styleUrls: ['./create-sucursal.component.scss']
})
export class CreateSucursalComponent {

  @Output() SucursalC:EventEmitter<any> = new EventEmitter();
  
    //Variables
    name: string ='';
    address: string = '';
    isLoading:any;
  
    constructor(
        public modal:NgbActiveModal,
        private http: HttpClient,
        public authservice: AuthService,
        public sucursalService: SucursalService,
        public toast: ToastrService,
      )
    {
      
    }
  
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      
    }
    //Función para guardar los permisos
    store()
    {
      if(!this.name)
      {
        this.toast.error("Validación","El nombre de la sucursal es requerido.");
        return false;
      }
      
      let data = {
        name: this.name,
        address: this.address
      }
  
      this.sucursalService.registerSucursal(data).subscribe((resp:any) => {
        console.log(resp);
        if(resp.message == 403)
        {
          this.toast.error("Validación",resp.message_text);
        }
        else
        {
          this.toast.success("Éxito","Sucursal añadida correctamente.");
          this.SucursalC.emit(resp.sucursal);
          this.modal.close();
        }
      });
    }
}
