import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientSegmentService } from '../service/client-segment.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-delete-client-segment',
  //imports: [],
  templateUrl: './delete-client-segment.component.html',
  styleUrls: ['./delete-client-segment.component.scss']
})
export class DeleteClientSegmentComponent {
  @Output() ClientSegmentD:EventEmitter<any> = new EventEmitter();
      //recibiendo datos del componente padre
      @Input() CLIENT_SEGMENT_SELECTED:any;
    
      //Variables
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
      }
      //Función para guardar los permisos
      delete()
      {
        
        this.clientSegmentService.deleteClientSegment(this.CLIENT_SEGMENT_SELECTED.id).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Segmento de cliente eliminado correctamente");
            this.ClientSegmentD.emit(resp.message);
            this.modal.close();
          }
        });
      }
}
