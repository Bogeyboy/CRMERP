import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ClientsService } from '../service/clients.service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-delete-clients',
  //standalone: true,
  //imports: [],
  templateUrl: './delete-clients.component.html',
  styleUrl: './delete-clients.component.scss'
})
export class DeleteClientsComponent {
  @Output() ClientsD = new EventEmitter<any>();
  //recibiendo datos del componente padre
  @Input() client_selected:any;

  //Variables
  isLoading:any;

  modal = inject(NgbActiveModal);
  private http = inject(HttpClient);
  authservice = inject(AuthService);
  clientsService = inject(ClientsService);
  toast = inject(ToastrService);

  ngOnInit(): void {
  }
  //Función para guardar los permisos
  delete()
  {

    this.clientsService.deleteClient(this.client_selected.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Cliente eliminado correctamente");
        this.ClientsD.emit(resp.message);
        this.modal.close();
      }
    });
  }
}
