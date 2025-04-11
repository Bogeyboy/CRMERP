import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientSegmentService } from '../service/client-segment.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-edit-client-segment',
  //imports: [],
  templateUrl: './edit-client-segment.component.html',
  styleUrls: ['./edit-client-segment.component.scss']
})
export class EditClientSegmentComponent {
  @Output() ClientSegmentE:EventEmitter<any> = new EventEmitter();
    @Input() CLIENT_SEGMENT_SELECTED:any;
    
      //Variables
      name: string ='';
      state: number = 1;
      id: number = 0;
      isLoading:any;
    
      constructor(
          public modal:NgbActiveModal,
          private http: HttpClient,
          public authservice: AuthService,
          public clientSegmentService: ClientSegmentService,
          public toast: ToastrService,
        )
      {
        
      }
    
      ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.name = this.CLIENT_SEGMENT_SELECTED.name;
        this.state = this.CLIENT_SEGMENT_SELECTED.state;
        //this.id = this.CLIENT_SEGMENT_SELECTED.id;
      }
      //Función para guardar los permisos
      store()
      {
        if(!this.name)
        {
          this.toast.error("Validación","El nombre del segmento de cliente es requerido.");
          return false;
        }
        
        let data = {
          name: this.name,
          state: this.state,
          id: this.id
        }
    
        this.clientSegmentService.updateClientSegment(this.CLIENT_SEGMENT_SELECTED.id, data).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Segmento de cliente editada correctamente.");
            this.ClientSegmentE.emit(resp.client_segment);
            this.modal.close();
          }
        });
      }
}
