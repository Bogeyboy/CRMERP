import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { UnitsService } from '../service/units.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteTransformUnitsComponent } from '../delete-transform-units/delete-transform-units.component';

@Component({
  selector: 'app-create-transform-units',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-transform-units.component.html',
  styleUrls: ['./create-transform-units.component.scss']
})
export class CreateTransformUnitsComponent {
  //@Output() UnitC:EventEmitter<any> = new EventEmitter();
  @Input() UNIT_SELECTED:any;
  @Input() UNITS:any = [];
  
  //Variables
  unit_to_id: string ='';
  isLoading:any;

  constructor(
    public modal:NgbActiveModal,
    private http: HttpClient,
    public authservice: AuthService,
    public unitService: UnitsService,
    public toast: ToastrService,
    public modalService: NgbModal,
  )
  {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }
  //Función para guardar las unidades
  store()
  {
    if(!this.unit_to_id)
    {
      this.toast.error("Validación","La unidad es requerido.");
      return false;
    }
    
    let data = {
      unit_id: this.UNIT_SELECTED.id,
      unit_to_id: this.unit_to_id,
    }

    this.unitService.registerUnitTransform(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Unidad añadida correctamente.");
        //this.UnitC.emit(resp.unit);
        this.UNIT_SELECTED.transforms.unshift(resp.unit);// transforms es la lista de unidades con las que se encuentra relacionada
        //this.modal.close();
      }
    });
  }
  //Función para remover unidades de transformación
  removeUnitTransform(transform: any)
  {
    const modalRef = this.modalService.open(DeleteTransformUnitsComponent,{centered:true, size: 'sm'});
    modalRef.componentInstance.TRANSFORM_SELECTED = transform;
    modalRef.componentInstance.UnitD.subscribe((transf:any) => {
      let INDEX = this.UNIT_SELECTED.transforms.findIndex((tran:any) => tran.id == transform.id);
      if(INDEX != -1){
        this.UNITS.splice(INDEX,1);
      }
    })
  }
}
