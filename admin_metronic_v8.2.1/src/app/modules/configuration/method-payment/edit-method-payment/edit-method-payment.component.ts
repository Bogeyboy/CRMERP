import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { MethodPaymentService } from '../service/method-payment.service';

@Component({
  selector: 'app-edit-method-payment',
  //imports: [],
  templateUrl: './edit-method-payment.component.html',
  styleUrls: ['./edit-method-payment.component.scss']
})
export class EditMethodPaymentComponent {
  @Output() MethodPaymentE:EventEmitter<any> = new EventEmitter();
  @Input() METHOD_PAYMENTS:any = [];
  @Input() METHOD_PAYMENT_SELECTED:any;
    
      //Variables
      name: string ='';
      state: number;
      method_payment_id: string = '';
      isLoading:any;
    
      constructor(
          public modal:NgbActiveModal,
          private http: HttpClient,
          public authservice: AuthService,
          public methodPaymentService: MethodPaymentService,
          public toast: ToastrService,
        )
      {
        
      }
    
      ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.name = this.METHOD_PAYMENT_SELECTED.name;
        this.state = this.METHOD_PAYMENT_SELECTED.state;
        this.method_payment_id = this.METHOD_PAYMENT_SELECTED.method_payment_id;
        //console.log("ID del metodo de pago: ",this.method_payment_id);
        
      }
      //Función para guardar los permisos
      store()
      {
        if(!this.name)
        {
          this.toast.error("Validación","El nombre del método de pago es requerido.");
          return false;
        }
        
        let data = {
          name: this.name,
          method_payment_id: this.method_payment_id,
          state: this.state,
        }
    
        this.methodPaymentService.updateMethodPayment(this.METHOD_PAYMENT_SELECTED.id, data).subscribe((resp:any) => {

          if(resp.message == 403)
          {
            this.toast.error("Validación",resp.message_text);
          }
          else
          {
            this.toast.success("Éxito","Método de pago editado correctamente.");
            this.MethodPaymentE.emit(resp.method_payment);
            this.modal.close();
          }
        });
      }

        /* store(){
    if(!this.name){
      this.toast.error("Validación","El nombre del metodo de pago es requerido");
      return false;
    }

    let data = {
      name: this.name,
      method_payment_id:this.method_payment_id,
      state: this.state,
    }
    this.methodPaymentService.updateMethodPayment(this.METHOD_PAYMENT_SELECTED.id,data).subscribe(
      (resp:any) =>
      {
        resp.method_payment.state = this.state;
        //console.log("Enviando datos al backend: ",resp.method_payment);
        if(resp.message == 403)
        {
          this.toast.error("Validación",resp.message_text);
        }
        else
        {
          //console.log("Datos enviados desde el modal: ",this.state);
          this.toast.success("Exito","El metodo de pago se registro correctamente");
          this.MethodPaymentE.emit(resp.method_payment);
          this.modal.close();
        }
      }
    )
  } */
}
