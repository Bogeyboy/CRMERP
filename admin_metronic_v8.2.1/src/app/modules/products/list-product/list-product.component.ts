import { Component } from '@angular/core';
import { ProductsService } from '../service/products.service';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-product',
  //imports: [],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {

  search:string = '';
  PRODUCTS:any = [];
  isLoading$:any;


  CATEGORIES:any = [];
  product_categorie_id:string = '';
  disponibilidad:string = '';
  tax_selected: string = '';

  //Variables para las sucursales
  sucursale_price_multiple:string = '';
  SUCURSALES:any = [];

  //Vvariables para el filtrado de almacenes
  almacen_warehouse: string = '';
  WAREHOUSES:any = [];

  //Variables para el filtrado por segmento de cliente
  client_segment_price_multiple:string = '';
  CLIENT_SEGMENTS:any = [];

  //Variables para el filtrado por estado del producto
  state:number = 0;
  STATES:any = [];

  //Variables para el filtrado por unidades de almacén
  UNITS:any = [];
  unit_warehouse: string = '';

  //Variables para el filtrado por proveedores
  PROVIDERS:any = [];
  provider_id: string = '';
  //provider_id: number = 0;

  //Objeto que contiene los filtros
  filtros: Record<string, any> = {
  product_categorie_id: '',
  disponibilidad: '',
  tax_selected: '',
  search: '',
  sucursale_price_multiple: '',
  almacen_warehouse: '',
  client_segment_price_multiple: '',
  state: '',
  //provider_id: '',
}

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public productService: ProductsService, // Replace with actual service type
  ) {
    
  }
  loadPage($event:any){
    this.listProducts();
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;
    this.listProducts();
    this.configAll();
  }
  configAll(){
    this.productService.configAll().subscribe((resp:any) => {
      //console.log(resp.providers);
      this.CATEGORIES = resp.categories;
      this.SUCURSALES = resp.sucursales;
      this.WAREHOUSES = resp.almacenes;
      this.CLIENT_SEGMENTS = resp.segments_clients;
      this.UNITS = resp.units;
      this.PROVIDERS = resp.providers;
    })
  }
  listProducts(page = 1){
    let data = {
      product_categorie_id: this.product_categorie_id,
      disponibilidad: this.disponibilidad,
      tax_selected: this.tax_selected,
      search: this.search,
      //FILTRADO ESPECIAL
      sucursale_price_multiple: this.sucursale_price_multiple,
      almacen_warehouse: this.almacen_warehouse,
      client_segment_price_multiple: this.client_segment_price_multiple,
      state: this.state,
      unit_warehouse: this.unit_warehouse,
      provider_id: this.provider_id,
    }
    //console.log(data);
    this.productService.listProducts(page, data).subscribe((resp: any) => {
      console.log(resp.products.data);
      console.log('Proveedor: ' + this.provider_id + typeof (this.provider_id));
      console.log('ID de categoria: ' + this.product_categorie_id + typeof (this.product_categorie_id));
      this.PRODUCTS = resp.products.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
  deleteProduct(PRODUCT:any){
      const modalRef = this.modalService.open(DeleteProductComponent,{centered:true, size: 'md'});
      modalRef.componentInstance.PRODUCT_SELECTED = PRODUCT;
  
      modalRef.componentInstance.ProductD.subscribe((prod:any) => {
        let INDEX = this.PRODUCTS.findIndex((prod:any) => prod.id == PRODUCT.id);
        if(INDEX != -1){
          this.PRODUCTS.splice(INDEX,1);
        }
      })
  }
  resetFilters(event: Event){
    //const etiqueta = (event.target as HTMLElement).tagName;
    const etiqueta = event.target as HTMLInputElement | HTMLSelectElement;
    const nombre = etiqueta.getAttribute('name');
    //const valor = etiqueta.getAttributeNames().find(attr => attr === 'value') ? etiqueta.getAttribute('value') : '';
    const valor = etiqueta.hasAttribute('value') ? etiqueta.getAttribute('value') : '';

    let data = {
      product_categorie_id: this.product_categorie_id,
      disponibilidad: this.disponibilidad,
      tax_selected: this.tax_selected,
      search: this.search,
      //FILTRADO ESPECIAL
      provider_id: this.provider_id,
      sucursale_price_multiple: this.sucursale_price_multiple,
      almacen_warehouse: this.almacen_warehouse,
      client_segment_price_multiple: this.client_segment_price_multiple,
      state: this.state
    }

    this.listProducts();

    if (nombre && this.filtros.hasOwnProperty(nombre)){
      this.filtros[nombre] = '';
      //console.log(`Resetting filter: ${nombre}`);
      console.log('Reseteando el filtro: ' + nombre);
      this.listProducts();
    } else {
      console.warn('No se encuentra el filtro a eliminar ' + nombre);
    }
    //console.log('Etiqueta del evento:', etiqueta.getAttribute('name'));
  }
  resetListProducts (){
    this.product_categorie_id = '';
    this.disponibilidad = '';
    this.tax_selected = '';
    this.search = '';
    this.sucursale_price_multiple = '';
    this.almacen_warehouse = '';
    this.client_segment_price_multiple = '';
    this.state = 0;
    this.unit_warehouse = '';
    this.provider_id = '';
    this.listProducts();
  }
  getDisponibilidad(val: number)
  {
    let TEXTO = '';
    switch (val) {
      case 1:
        TEXTO = 'Vender los productos sin stock';
        break;
      case 2:
        TEXTO = 'No Vender los productos con stock'; 
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
