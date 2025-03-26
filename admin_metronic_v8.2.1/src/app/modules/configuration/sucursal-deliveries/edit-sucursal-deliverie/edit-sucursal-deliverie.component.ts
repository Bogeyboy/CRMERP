import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { SucursalDeliverieService } from '../service/sucursal-deliverie.service';

@Component({
  selector: 'app-edit-sucursal-deliverie',
  //imports: [],
  templateUrl: './edit-sucursal-deliverie.component.html',
  styleUrls: ['./edit-sucursal-deliverie.component.scss']
})
export class EditSucursalDeliverieComponent {
  @Output() SucursalE:EventEmitter<any> = new EventEmitter();
    @Input() SUCURSAL_SELECTED:any;
    
      //Variables
      name: string ='';
      address: string = '';
      state: number = 1;
      id: number = 0;
      isLoading:any;
    
      constructor(
          public modal:NgbActiveModal,
          private http: HttpClient,
          public authservice: AuthService,
          public sucursalDeliverieService: SucursalDeliverieService,
          public toast: ToastrService,
        )
      {
        
      }
    
      ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.name = this.SUCURSAL_SELECTED.name;
        this.address = this.SUCURSAL_SELECTED.address;
        this.state = this.SUCURSAL_SELECTED.state;
        this.id = this.SUCURSAL_SELECTED.id;
      }
      //Función para guardar los permisos
      store()
      {
        if(!this.name)
        {
          this.toast.error("Validación","El nombre del lugar de entrega es requerido.");
          return false;
        }
        
        let data = {
          name: this.name,
          address: this.address,
          state: this.state,
          id: this.id
        }
    
        this.sucursalDeliverieService.updateSucursalDeliverie(this.SUCURSAL_SELECTED.id, data).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Lugar de entrega editado correctamente.");
            this.SucursalE.emit(resp.sucursal);
            this.modal.close();
          }
        });
      }
}
