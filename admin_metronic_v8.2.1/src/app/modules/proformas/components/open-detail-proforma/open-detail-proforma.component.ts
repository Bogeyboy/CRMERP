import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-open-detail-proforma',
  /* standalone: true,
  imports: [], */
  templateUrl: './open-detail-proforma.component.html',
  styleUrls: ['./open-detail-proforma.component.scss']
})
export class OpenDetailProformaComponent {
  @Input() PROFORMA: any;
  //@Output() ProformaSelected :EventEmitter<any> = new EventEmitter();

  isLoading:any;

  constructor(
    public modal: NgbActiveModal
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.PROFORMA);
  }

  /* selectProforma(proforma:any)
  {
    console.log('Proforma seleccionada en el modal:', proforma);
    this.ProformaSelected.emit(proforma);
    //this.modal.close();
    setTimeout(() =>{
      this.modal.close();
    }, 50);
  } */
}
