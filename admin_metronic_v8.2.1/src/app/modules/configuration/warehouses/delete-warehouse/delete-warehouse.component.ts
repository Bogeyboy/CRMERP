import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { WarehouseService } from '../service/warehouse.service';

@Component({
  selector: 'app-delete-warehouse',
  templateUrl: './delete-warehouse.component.html',
  styleUrls: ['./delete-warehouse.component.scss']
})
export class DeleteWarehouseComponent {

  @Output() WarehouseD:EventEmitter<any> = new EventEmitter();
      //recibiendo datos del componente padre
      @Input() WAREHOUSE_SELECTED:any;
    
      //Variables
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
      }
      //Función para guardar los permisos
      delete()
      {
        
        this.warehouseService.deleteWarehouse(this.WAREHOUSE_SELECTED.id).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Almacén eliminado correctamente");
            this.WarehouseD.emit(resp.message);
            this.modal.close();
          }
        });
      }
}
