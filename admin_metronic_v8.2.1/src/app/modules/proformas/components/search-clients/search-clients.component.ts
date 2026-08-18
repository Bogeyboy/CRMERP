import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-clients.component.html',
  styleUrl: './search-clients.component.scss'
})
export class SearchClientsComponent {

  @Input() clients: any = [];
  @Output() ClientSelected :EventEmitter<any> = new EventEmitter();

  isLoading:any;

  constructor(
    public modal: NgbActiveModal
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.clients);
  }

  selectClient(client:any)
  {
    console.log('Cliente seleccionado en modal:', client);
    this.ClientSelected.emit(client);
    //this.modal.close();
    setTimeout(() =>{
      this.modal.close();
    }, 50);
  }
}
