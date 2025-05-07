import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UnitsService } from '../service/units.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-edit-units',
  //imports: [],
  templateUrl: './edit-units.component.html',
  styleUrls: ['./edit-units.component.scss']
})
export class EditUnitsComponent {
  @Output() UnitE:EventEmitter<any> = new EventEmitter();
  @Input() UNIT_SELECTED:any;
  
  //Variables
  name: string ='';
  state: number = 1;
  description: string ='';
  id: number = 0;
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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.name = this.UNIT_SELECTED.name;
    this.state = this.UNIT_SELECTED.state;
    this.description = this.UNIT_SELECTED.description;
    this.id = this.UNIT_SELECTED.id;
  }
  //Función para guardar los permisos
  store()
  {
    if(!this.name)
    {
      this.toast.error("Validación","El nombre de la unidad es requerido.");
      return false;
    }
    
    let data = {
      name: this.name,
      state: this.state,
      description: this.description,
      id: this.id
    }

    this.unitService.updateUnits(this.UNIT_SELECTED.id, data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Unidad editada correctamente.");
        this.UnitE.emit(resp.unit);
        this.modal.close();
      }
    });
  }
}
