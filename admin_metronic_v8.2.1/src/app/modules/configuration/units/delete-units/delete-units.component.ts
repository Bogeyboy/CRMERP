import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UnitsService } from '../service/units.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-delete-units',
  //imports: [],
  templateUrl: './delete-units.component.html',
  styleUrls: ['./delete-units.component.scss']
})
export class DeleteUnitsComponent {
  @Output() UnitD:EventEmitter<any> = new EventEmitter();
    //recibiendo datos del componente padre
  @Input() UNIT_SELECTED:any;

  //Variables
  isLoading:any;
  constructor(
      public modal:NgbActiveModal,
      private http: HttpClient,
      public authservice: AuthService,
      public unitService: UnitsService,
      public toast: ToastrService,
    )
  {
    
  }

  ngOnInit(): void {
  }
  //Función para guardar los permisos
  delete()
  {
    
    this.unitService.deleteUnit(this.UNIT_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Unidad eliminada correctamente");
        this.UnitD.emit(resp.message);
        this.modal.close();
      }
    });
  }
}
