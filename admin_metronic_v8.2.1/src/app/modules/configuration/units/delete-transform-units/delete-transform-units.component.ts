import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { UnitsService } from '../service/units.service';
import { AsyncPipe} from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-transform-units',
  standalone: true,
  imports: [AsyncPipe, CommonModule], 
  templateUrl: './delete-transform-units.component.html',
  styleUrls: ['./delete-transform-units.component.scss']
})
export class DeleteTransformUnitsComponent {
  @Output() UnitD:EventEmitter<any> = new EventEmitter();
  //@Output() UnitTD:EventEmitter<any> = new EventEmitter();
    //recibiendo datos del componente padre
  @Input() TRANSFORM_SELECTED:any;

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
    
    this.unitService.deleteUnitTransform(this.TRANSFORM_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Unidad de transformación eliminada correctamente");
        this.UnitD.emit(resp.message);
        this.modal.close();
      }
    });
  }
}