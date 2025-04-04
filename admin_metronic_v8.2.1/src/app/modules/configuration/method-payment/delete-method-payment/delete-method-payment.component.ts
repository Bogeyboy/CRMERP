import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { MethodPaymentService } from '../service/method-payment.service';

@Component({
  selector: 'app-delete-method-payment',
  //imports: [],
  templateUrl: './delete-method-payment.component.html',
  styleUrls: ['./delete-method-payment.component.scss']
})
export class DeleteMethodPaymentComponent {
@Output() MethodPaymentD:EventEmitter<any> = new EventEmitter();
    //recibiendo datos del componente padre
    @Input() METHOD_PAYMENT_SELECTED:any;
  
    //Variables
    isLoading:any;

    constructor(
        public modal:NgbActiveModal,
        private http: HttpClient,
        public authservice: AuthService,
        public method_paymentService: MethodPaymentService,
        public toast: ToastrService,
      )
    {
      
    }
  
    ngOnInit(): void {
    }
    //Función para guardar los permisos
    delete()
    {
      
      this.method_paymentService.deleteMethodPayment(this.METHOD_PAYMENT_SELECTED.id).subscribe((resp:any) => {
        console.log(resp);
        if(resp.message == 403)
        {
          this.toast.error("Validación",resp.message_text);
        }
        else
        {
          this.toast.success("Éxito","Método de pago eliminado correctamente");
          this.MethodPaymentD.emit(resp.message);
          this.modal.close();
        }
      });
    }
}
