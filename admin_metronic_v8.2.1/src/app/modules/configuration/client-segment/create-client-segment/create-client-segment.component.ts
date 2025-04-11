import { Component, EventEmitter, Output } from '@angular/core';
import { ClientSegmentService } from '../service/client-segment.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-create-client-segment',
  //imports: [],
  templateUrl: './create-client-segment.component.html',
  styleUrls: ['./create-client-segment.component.scss']
})
export class CreateClientSegmentComponent {
  @Output() ClientSegmentC:EventEmitter<any> = new EventEmitter();
    
      //Variables
      name: string ='';
      address: string = '';
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
          //address: this.address
        }
    
        this.clientSegmentService.registerClientSegment(data).subscribe((resp:any) => {
          console.log(resp);
          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Segmento de cliente añadida correctamente.");
            this.ClientSegmentC.emit(resp.client_segment);
            this.modal.close();
          }
        });
      }
}
