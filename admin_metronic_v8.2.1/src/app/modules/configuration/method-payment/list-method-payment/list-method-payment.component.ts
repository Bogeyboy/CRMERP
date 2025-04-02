import { Component } from '@angular/core';
import { MethodPaymentService } from '../service/method-payment.service';
import { CreateMethodPaymentComponent } from '../create-method-payment/create-method-payment.component';
import { EditMethodPaymentComponent } from '../edit-method-payment/edit-method-payment.component';
import { DeleteMethodPaymentComponent } from '../delete-method-payment/delete-method-payment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-method-payment',
  //imports: [],
  templateUrl: './list-method-payment.component.html',
  styleUrls: ['./list-method-payment.component.scss']
})
export class ListMethodPaymentComponent {
  search:string = '';
      METHOD_PAYMENTS:any[];
      isLoading$:any;
    
      totalPages:number = 0;
      currentPage:number = 1;
    
      constructor(
        public modalService: NgbModal,
        public methodpaymentService: MethodPaymentService,)
      {
    
      }
      
      ngOnInit(): void 
      {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.isLoading$ = this.methodpaymentService.isLoading$;
        this.listMethodPayments();
      }
    
      //PARA CREAR UNA SUCURSAL
      createMethodPayment()
      {
        const modalRef = this.modalService.open(CreateMethodPaymentComponent,{centered:true,size:'md'});
        modalRef.componentInstance.METHOD_PAYMENTS = this.METHOD_PAYMENTS.filter((method:any) => !method.method_payment_id);
        //Recibimos los datos del componente hijo
        modalRef.componentInstance.MethodPaymentC.subscribe((method_payment:any) => {
          console.log(method_payment);
          //this.METHOD_PAYMENTS.push(method_payment);//Se agrega al final del listado
          this.METHOD_PAYMENTS.unshift(method_payment);//Se agrega al principio del listado
        });
      }
    
      //PARA LISTAR LAS METHOD_PAYMENTS
      listMethodPayments(page = 1)
      {
        this.methodpaymentService.listMethodPayments(page,this.search).subscribe((resp:any) => {
          /* console.log("Salida del servicio listMethodPayments()");
          console.log(resp); */
          this.METHOD_PAYMENTS = resp.method_payments;
          this.totalPages = resp.total;
          this.currentPage = page;
        });
      }
      //Edición de sucursal
      editMethodPayment(METHOD_PAYMENT:any)
      {
        const modalRef = this.modalService.open(EditMethodPaymentComponent,{centered:true,size:'md'});
    
        modalRef.componentInstance.METHOD_PAYMENT_SELECTED = METHOD_PAYMENT;
        modalRef.componentInstance.METHOD_PAYMENTS = this.METHOD_PAYMENTS.filter((method:any) => !method.method_payment_id);
    
        //Recibimos los datos del componente hijo
        modalRef.componentInstance.MethodPaymentE.subscribe((method_payment:any) => {

          let INDEX = this.METHOD_PAYMENTS.findIndex((method_pay:any) => method_pay.id == METHOD_PAYMENT.id);
          //console.log("Datos recibidos desde el mmodal: ",method_payment);
          if(INDEX!=-1)
          {
            this.METHOD_PAYMENTS[INDEX] = method_payment;
            
          }
        });
      }

      //Eliminación de sucursal
      deleteMethodPayment(METHOD_PAYMENT:any)
      {
        const modalRef = this.modalService.open(DeleteMethodPaymentComponent,{centered:true,size:'md'});
  
        modalRef.componentInstance.METHOD_PAYMENT_SELECTED = METHOD_PAYMENT;
  
        //Recibimos los datos del componente hijo
        modalRef.componentInstance.MethodPaymentD.subscribe((method_payment:any) => {
          let INDEX = this.METHOD_PAYMENTS.findIndex((method_pay:any) => method_pay.id == METHOD_PAYMENT.id);
          if(INDEX!=-1)
          {
            //this.ROLES[INDEX] = rol;
            this.METHOD_PAYMENTS.splice(INDEX,1); //para eliminar un rol
          }
        });
      }
    
      //Función para las acciones tras el cambio de pagina en la paginación
      loadPage($event:any)
      {
        this.listMethodPayments($event);
      }
}
