import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProvidersService } from '../service/providers.service';

@Component({
  selector: 'app-delete-providers',
  //imports: [],
  templateUrl: './delete-providers.component.html',
  styleUrls: ['./delete-providers.component.scss']
})
export class DeleteProvidersComponent {
  @Output() ProviderD: EventEmitter<any> = new EventEmitter();
  @Input()  PROVIDER_SELECTED:any;

  name:string = '';
  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public providerService: ProvidersService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
  }

  delete(){
    
    this.providerService.deleteProvider(this.PROVIDER_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El proveedor se eliminó correctamente.");
        this.ProviderD.emit(resp.provider);
        this.modal.close();
      }
    })
  }
}
