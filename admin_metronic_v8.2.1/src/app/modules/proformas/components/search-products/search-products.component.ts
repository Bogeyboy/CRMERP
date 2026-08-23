import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss']
})
export class SearchProductsComponent
{
  @Input() products: any = [];
  @Output() ProductSelected :EventEmitter<any> = new EventEmitter();

  isLoading:any;

  constructor(
    public modal: NgbActiveModal
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.products);
  }

  selectProduct(product:any)
  {
    console.log('Producto seleccionado en modal:', this.products);
    //this.ProductSelected.emit(this.products);
    this.ProductSelected.emit(product);
    //this.modal.close();
    setTimeout(() =>{
      this.modal.close();
    }, 50);
  }

  getDisponibilidad(val: number)
  {
    let TEXTO = '';
    switch (val) {
      case 1:
        TEXTO = 'Vender los productos sin stock';
        break;
      case 2:
        TEXTO = 'No Vender los productos sin stock';
        break;
      case 3:
        TEXTO = 'Proyectar con los contratos que se tenga';
        break;
    }
    return TEXTO;
  }

  getTaxSelected(val: number)
  {
    let TEXTO = '';
    switch (val) {
      case 1:
        TEXTO = 'Libre de impuestos';
        break;
      case 2:
        TEXTO = 'Bienes gravables';
        break;
      case 3:
        TEXTO = 'Producto descargable';
        break;
    }
    return TEXTO;
  }
}