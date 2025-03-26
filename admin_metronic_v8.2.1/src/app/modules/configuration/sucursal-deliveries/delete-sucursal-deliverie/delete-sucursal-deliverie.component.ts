import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { SucursalDeliverieService } from '../service/sucursal-deliverie.service';

@Component({
  selector: 'app-delete-sucursal-deliverie',
  //imports: [],
  templateUrl: './delete-sucursal-deliverie.component.html',
  styleUrls: ['./delete-sucursal-deliverie.component.scss']
})
export class DeleteSucursalDeliverieComponent {
  @Output() SucursalD:EventEmitter<any> = new EventEmitter();
      //recibiendo datos del componente padre
      @Input() SUCURSAL_SELECTED:any;
    
      //Variables
      isLoading:any;
  
      constructor(
          public modal:NgbActiveModal,
          private http: HttpClient,
          public authservice: AuthService,
          public sucursalesDeliverieService: SucursalDeliverieService,
          public toast: ToastrService,
        )
      {
        
      }
    
      ngOnInit(): void {
      }
      //Función para guardar los permisos
      delete()
      {
        
        this.sucursalesDeliverieService.deleteSucursalDeliverie(this.SUCURSAL_SELECTED.id).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","El lugar de entrega se eliminó correctamente.");
            this.SucursalD.emit(resp.message);
            this.modal.close();
          }
        });
      }
}
