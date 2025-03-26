import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { SucursalDeliverieService } from '../service/sucursal-deliverie.service';

@Component({
  selector: 'app-create-sucursal-deliverie',
  //imports: [],
  templateUrl: './create-sucursal-deliverie.component.html',
  styleUrls: ['./create-sucursal-deliverie.component.scss']
})
export class CreateSucursalDeliverieComponent {
  
  @Output() SucursalC:EventEmitter<any> = new EventEmitter();
    
      //Variables
      name: string ='';
      address: string = '';
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
          address: this.address
        }
    
        this.sucursalDeliverieService.registerSucursalDeliverie(data).subscribe((resp:any) => {
          console.log("Respuesta del backend: ",resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Lugar de entreta añadido correctamente.");
            this.SucursalC.emit(resp.sucursal);
            this.modal.close();
          }
        });
      }
}
