import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { UnitsService } from '../service/units.service';

@Component({
  selector: 'app-create-units',
  //imports: [],
  templateUrl: './create-units.component.html',
  styleUrls: ['./create-units.component.scss']
})
export class CreateUnitsComponent {
  @Output() UnitC:EventEmitter<any> = new EventEmitter();
  
  //Variables
  name: string ='';
  description: string = '';
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
      description: this.description
    }

    this.unitService.registerUnit(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Unidad añadida correctamente.");
        this.UnitC.emit(resp.unit);
        this.modal.close();
      }
    });
  }
}
