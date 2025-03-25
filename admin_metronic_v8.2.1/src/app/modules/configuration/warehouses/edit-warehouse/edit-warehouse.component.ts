import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { WarehouseService } from '../service/warehouse.service';

@Component({
  selector: 'app-edit-warehouse',
  templateUrl: './edit-warehouse.component.html',
  styleUrls: ['./edit-warehouse.component.scss']
})
export class EditWarehouseComponent {
  @Output() WarehouseE:EventEmitter<any> = new EventEmitter(); //Envia datos del componente padre al componente hijo
  @Input() SUCURSALES:any = [];
  @Input() WAREHOUSE_SELECTED: any;
    
      //Variables
      name: string ='';
      address: string = '';
      sucursale_id: string = '';

      isLoading:any;
    
      constructor(
          public modal:NgbActiveModal,
          private http: HttpClient,
          public authservice: AuthService,
          public warehouseService: WarehouseService,
          public toast: ToastrService,
        )
      {
        
      }
    
      ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        this.name = this.WAREHOUSE_SELECTED.name;
        this.address = this.WAREHOUSE_SELECTED.address;
        this.sucursale_id = this.WAREHOUSE_SELECTED.sucursale_id;
        
      }
      //Función para guardar los permisos
      store()
      {
        if(!this.name)
        {
          this.toast.error("Validación","El nombre del almacén es requerido.");
          return false;
        }
        
        let data = {
          name: this.name,
          address: this.address,
          sucursale_id: this.sucursale_id
        }
    
        this.warehouseService.updateWarehouse(this.WAREHOUSE_SELECTED.id, data).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Almacén editado correctamente.");
            this.WarehouseE.emit(resp.warehouse);
            this.modal.close();
          }
        });
      }
}
