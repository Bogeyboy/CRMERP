import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../service/products.service';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_SERVICIOS } from 'src/app/config/config';
import { data } from 'jquery';

@Component({
  selector: 'app-list-product',
  //imports: [],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

  search = '';
  PRODUCTS:any = [];
  isLoading$:any;

  CATEGORIES:any = [];
  product_categorie_id = '';
  disponibilidad = '';
  tax_selected = '';

  //Variables para las sucursales
  sucursale_price_multiple = '';
  SUCURSALES:any = [];

  //Vvariables para el filtrado de almacenes
  almacen_warehouse = '';
  WAREHOUSES:any = [];

  //Variables para el filtrado por segmento de cliente
  client_segment_price_multiple = '';
  CLIENT_SEGMENTS:any = [];

  //Variables para el filtrado por estado del producto
  state = 0;
  STATES:any = [];

  //Variables para el filtrado por unidades de almacén
  UNITS:any = [];
  unit_warehouse = '';

  //Variables para el filtrado por proveedores
  PROVIDERS:any = [];
  provider_id = '';
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

  totalPages = 0;
  currentPage = 1;
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
      //console.log(resp.almacenes);
      this.CATEGORIES = resp.categories;
      this.SUCURSALES = resp.sucursales;
      this.WAREHOUSES = resp.almacenes;
      this.CLIENT_SEGMENTS = resp.segments_clients;
      this.UNITS = resp.units;
      this.PROVIDERS = resp.providers;
      //this.diagnosticarFiltros();
    })
  }

  diagnosticarFiltros() {
    console.log('=== DIAGNÓSTICO DE FILTROS ===');
    console.log('1. Valores actuales:');
    console.log('   - sucursale_price_multiple:', this.sucursale_price_multiple);
    console.log('   - almacen_warehouse:', this.almacen_warehouse);
    console.log('   - client_segment_price_multiple:', this.client_segment_price_multiple);
    console.log('   - unit_warehouse:', this.unit_warehouse);

    console.log('2. Datos de configuración:');
    console.log('   - SUCURSALES cargadas:', this.SUCURSALES.length);
    console.log('   - ALMACENES cargados:', this.WAREHOUSES.length);
    console.log('   - SEGMENTOS cargados:', this.CLIENT_SEGMENTS.length);
    console.log('   - UNIDADES cargadas:', this.UNITS.length);
    console.log('   - PROVEEDORES cargados:', this.PROVIDERS.length);
    console.log('   - CATEGORÍAS cargadas:', this.CATEGORIES.length);
  }

  listProducts(page = 1) {
    // Construir objeto de filtros
    //this.debugFilters();

    const filters: any = {};

    if (this.product_categorie_id && this.product_categorie_id.toString().trim() !== '') {
      filters.product_categorie_id = this.product_categorie_id;
    }

    if (this.disponibilidad && this.disponibilidad.toString().trim() !== '') {
      filters.disponibilidad = this.disponibilidad;
    }

    if (this.tax_selected && this.tax_selected.toString().trim() !== '') {
      filters.tax_selected = this.tax_selected;
    }

    if (this.search && this.search.trim() !== '') {
      filters.search = this.search;
    }

    if (this.provider_id && this.provider_id.toString().trim() !== '') {
      filters.provider_id = this.provider_id;
    }

    if (this.sucursale_price_multiple && this.sucursale_price_multiple.toString().trim() !== '') {
      filters.sucursale_price_multiple = this.sucursale_price_multiple;
    }

    if (this.almacen_warehouse && this.almacen_warehouse.toString().trim() !== '') {
      filters.almacen_warehouse = this.almacen_warehouse;
    }

    if (this.client_segment_price_multiple && this.client_segment_price_multiple.toString().trim() !== '') {
      filters.client_segment_price_multiple = this.client_segment_price_multiple;
    }

    if (this.unit_warehouse && this.unit_warehouse.toString().trim() !== '') {
      filters.unit_warehouse = this.unit_warehouse;
    }

    // Estado - solo si es diferente de 0
    if (this.state !== 0 && this.state !== null && this.state !== undefined) {
      filters.state = this.state;
    }

    this.productService.listProducts(page, filters).subscribe({
      next: (resp: any) => {
        console.log('📦 RESPUESTA COMPLETA DEL SERVIDOR:', resp.data);
        this.procesarRespuesta(resp);
        this.currentPage = page;
      },
      error: (error) => {
        console.error('❌ ERROR EN LA PETICIÓN:', error);
        console.error('Detalles del error:', error.error);
      }
    });
  }
  
  procesarRespuesta(resp: any) {
    console.log('📦 Procesando respuesta:', resp);

    // Limpiar productos anteriores
    this.PRODUCTS = [];

    // Caso 1: Respuesta con propiedad 'data' (formato paginado)
    if (resp.data && Array.isArray(resp.data)) {
      this.PRODUCTS = resp.data;
      this.totalPages = resp.total || resp.data.total || 0;
      console.log('✅ Formato 1: data como array');
    }
    // Caso 2: Respuesta con propiedad 'products'
    else if (resp.products) {
      if (Array.isArray(resp.products)) {
        this.PRODUCTS = resp.products;
      } else if (resp.products.data && Array.isArray(resp.products.data)) {
        this.PRODUCTS = resp.products.data;
      }
      this.totalPages = resp.total || resp.products.total || this.PRODUCTS.length;
      console.log('✅ Formato 2: products');
    }
    // Caso 3: Respuesta es directamente un array
    else if (Array.isArray(resp)) {
      this.PRODUCTS = resp;
      this.totalPages = resp.length;
      console.log('✅ Formato 3: array directo');
    }
    // Caso 4: Buscar en otras propiedades
    else {
      const possibleProps = ['items', 'results', 'lista', 'productos'];
      for (const prop of possibleProps) {
        if (resp[prop]) {
          if (Array.isArray(resp[prop])) {
            this.PRODUCTS = resp[prop];
          } else if (resp[prop].data && Array.isArray(resp[prop].data)) {
            this.PRODUCTS = resp[prop].data;
          } else {
            continue;
          }
          this.totalPages = resp.total || resp[prop]?.total || this.PRODUCTS.length;
          console.log(`✅ Formato 4: encontrado en "${prop}"`);
          break;
        }
      }
    }

    // Si no se encontró nada, array vacío
    if (this.PRODUCTS.length === 0) {
      console.log('⚠️ No se encontraron productos');
      this.PRODUCTS = [];
      this.totalPages = 0;
    }

    console.log('✅ Productos cargados:', this.PRODUCTS.length);
  }

  resetListProducts (){
    console.log('🔄 RESETEANDO FILTROS');
    this.product_categorie_id = '';
    this.disponibilidad = '';
    this.tax_selected = '';
    this.search = '';
    this.sucursale_price_multiple = '';
    this.almacen_warehouse = '';
    this.client_segment_price_multiple = '';
    this.state = 1;
    this.unit_warehouse = '';
    this.provider_id = '';
    console.log('✅ Filtros reseteados');
    this.listProducts(1);
  }

  deleteProduct(PRODUCT:any){
      const modalRef = this.modalService.open(DeleteProductComponent,{centered:true, size: 'md'});
      modalRef.componentInstance.PRODUCT_SELECTED = PRODUCT;

      modalRef.componentInstance.ProductD.subscribe((prod:any) => {
        const INDEX = this.PRODUCTS.findIndex((prod:any) => prod.id == PRODUCT.id);
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

    const data = {
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
  isLoadingProcess(){
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  downloadProducts(){
    /* const data = {
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
    } */
    let LINK ="";

    if (this.product_categorie_id){
      LINK += "&product_categorie_id="+this.product_categorie_id;
    }
    if (this.disponibilidad){
      LINK += "&disponibilidad="+this.disponibilidad;
    }
    if (this.tax_selected){
      LINK += "&tax_selected="+this.tax_selected;
    }
    if (this.search){
      LINK += "&search="+this.search;
    }
    if (this.provider_id){
      LINK += "&provider_id="+this.provider_id;
    }
    if (this.sucursale_price_multiple){
      LINK += "&sucursale_price_multiple="+this.sucursale_price_multiple;
    }
    if (this.almacen_warehouse){
      LINK += "&almacen_warehouse="+this.almacen_warehouse;
    }
    if (this.client_segment_price_multiple){
      LINK += "&client_segment_price_multiple="+this.client_segment_price_multiple;
    }
    if (this.state){
      LINK += "&state="+this.state;
    }
    window.open(URL_SERVICIOS+"/excel/export-products?k=1"+LINK,"_blank");
  }
}
