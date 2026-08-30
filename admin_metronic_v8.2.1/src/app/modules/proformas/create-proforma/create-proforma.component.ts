import { FormatNumberPipe } from './../../../pipes/format-number.pipe';
import { EditProductDetailProformaComponent } from './../components/edit-product-detail-proforma/edit-product-detail-proforma.component';
import { ProformasService } from './../service/proformas.service';
import { Component, inject, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { NgbModal, NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreateClientsPersonComponent } from '../../clients/create-clients-person/create-clients-person.component';
import { CreateClientsCompanyComponent } from '../../clients/create-clients-company/create-clients-company.component';
import { ThisReceiver } from '@angular/compiler';
import { SearchClientsComponent } from '../components/search-clients/search-clients.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { data } from 'jquery';
import { SearchProductsComponent } from '../components/search-products/search-products.component';
import { filter } from 'rxjs/operators';
import { DeleteProductDetailProformaComponent } from '../components/delete-product-detail-proforma/delete-product-detail-proforma.component';
@Component({
  selector: 'app-create-proforma',
  standalone: true,
  imports: [
    CommonModule,    // ✅ Para directivas como ngFor, ngIf
    FormsModule,     // ✅ Para ngModel
    NgbModule,
    SearchClientsComponent, // ✅ Importa el componente standalone
    CreateClientsPersonComponent,
    CreateClientsCompanyComponent,
    FormatNumberPipe,
  ],
  templateUrl: './create-proforma.component.html',
  styleUrls: ['./create-proforma.component.scss']
})

export class CreateProformaComponent implements AfterViewInit
{
  //VARIABLES DE LOS CLIENTES
  CLIENT_SELECTED:any;

  n_document = '';
  full_name = '';
  phone = '';
  birthdate: string | null  = null;
  displayBirthdate = '';
  //VARIABLES DE LOS PRODUCTOS
  PRODUCT_SELECTED:any;
  loadUnidad = false;
  price = 0;
  quantity_product = 0;
  unit = '';
  unidad_product = '';
  almacen_product = '';
  description_product = '';
  search_product = '';
  warehouses_product:any = [];
  exists_warehouse:any = [];
  amount_discount = 0;

  //VARIABLES DETALLADO DE LA PROFORMA
  DETAIL_PROFORMAS:any = [];
  TOTAL_IMPUESTO_PROFORMA = 0;
  TOTAL_PROFORMA = 0;
  DEBT_PROFORMA = 0;
  PAID_OUT_PROFORMA = 0;

  //VARIABLES DE DIRECCIÓN
  address = '';
  delivery_date = '';

  delivery_place = '';

  ubigeo_region = '';
  ubigeo_provincia = '';
  ubigeo_distrito = '';
  region = '';
  provincia = '';
  REGIONES: any = [];
  PROVINCIAS: any = [];
  DISTRITOS: any = [];
  PROVINCIA_SELECTEDS: any = [];
  DISTRITOS_SELECTEDS: any = [];

  //VARIABLES DE REPARTO
  full_name_encargado = '';
  agencia = '';
  documento_encargado = '';
  telefono_encargado = '';

  //VARIABLES DEL PAGO
  amount_payment = 0;

  //VARIABLES VARIAS
  client_segments: any = [];
  asesores: any = [];
  //sucursale_asesor = '';
  sucursale_asesor = 0;
  user:any;

  isLoading$: any;

  @ViewChild('clientDocumentInput') clientDocumentInput!: ElementRef;
  @ViewChild('clientNameInput') clientNameInput!: ElementRef;
  @ViewChild('clientPhoneInput') clientPhoneInput!: ElementRef;
  @ViewChild('productSearchInput') productSearchInput!: ElementRef;

  constructor(
    private modalService: NgbModal,
    private proformaService: ProformasService,
    public toast : ToastrService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef
  )
  {

  }
  isLoadingProcess(){
    this.proformaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);
    }, 50);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this. isLoading$ = this.proformaService.isLoading$;
    this.user = this.proformaService.authservice.user;
    this.sucursale_asesor = Number(this.user.sucursale_id);
    this.proformaService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
    });
  }

  ngAfterViewInit()
  {
    // Usar setTimeout para asegurar que el DOM está listo
    setTimeout(() => {
      // Configurar listeners para clientes usando ViewChild
      this.setupClientListeners();

      // Configurar listener para producto usando ViewChild
      this.setupProductListener();
    }, 100); // Reducir tiempo de espera
  }

  setupClientListeners()
  {
    // Método 1: Usando ViewChild
    if (this.clientDocumentInput)
    {
      // Remover listeners anteriores para evitar duplicados
      this.clientDocumentInput.nativeElement.removeEventListener('keydown', this.handleClientEnter);
      this.clientDocumentInput.nativeElement.addEventListener('keydown', this.handleClientEnter);
      console.log('✅ Listener agregado al input de documento');
    }

    if (this.clientNameInput)
    {
      this.clientNameInput.nativeElement.removeEventListener('keydown', this.handleClientEnter);
      this.clientNameInput.nativeElement.addEventListener('keydown', this.handleClientEnter);
      console.log('✅ Listener agregado al input de nombre');
    }

    if (this.clientPhoneInput)
    {
      this.clientPhoneInput.nativeElement.removeEventListener('keydown', this.handleClientEnter);
      this.clientPhoneInput.nativeElement.addEventListener('keydown', this.handleClientEnter);
      console.log('✅ Listener agregado al input de teléfono');
    }
  }

  setupProductListener()
  {
    // Usando ViewChild
    if (this.productSearchInput) {
      this.productSearchInput.nativeElement.removeEventListener('keydown', this.handleProductEnter);
      this.productSearchInput.nativeElement.addEventListener('keydown', this.handleProductEnter);
      console.log('✅ Listener agregado al input de producto');
    }
  }

  // Manejadores de eventos como métodos de clase
  handleClientEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter')
    {
      event.preventDefault();
      event.stopPropagation();
      console.log('🔍 Enter en cliente (handler)');
      this.searchClients();
    }
  }

  handleProductEnter = (event: KeyboardEvent) =>
  {
    if (event.key === 'Enter')
    {
      event.preventDefault();
      event.stopPropagation();
      console.log('🔍 Enter en producto (handler)');
      this.searchProducts();
    }
  }

  convertToBackendFormat(dateStr: string): string | null
  {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  convertToInputFormat(dateStr: string): string | null
  {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }

  updateBirthdate(event: any)
  {
    const value = event.target.value;
    if (value) {
      const [year, month, day] = value.split('-');
      this.birthdate = `${day}-${month}-${year}`;
    }
    else
    {
      this.birthdate = null;
    }
  }

  setBirthdateFromBackend(dateStr: string)
  {
    if (dateStr)
    {
      // Si viene en formato DD-MM-YYYY, lo convertimos a YYYY-MM-DD para el input
      const parts = dateStr.split('-');
      if (parts.length === 3 && parts[0].length === 2)
      {
        this.displayBirthdate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        // También actualizamos birthdate para el backend
        this.birthdate = dateStr;
      }
      else
      {
        // Si ya viene en otro formato, lo usamos directamente
        this.displayBirthdate = dateStr;
        this.birthdate = dateStr;
      }
    }
    else
    {
      this.displayBirthdate = '';
      this.birthdate = null;
    }
  }

  changeRegion($event: any)
  {
    console.log($event.target.value);
    let REGION_ID = $event.target.value;
    //let REGION_SELECTED = this.REGIONES.find((region:any)=>region.id = REGION_ID);
    let REGION_SELECTED = this.REGIONES.find((region:any)=>region.id === REGION_ID);
    if(REGION_SELECTED)
    {
      this.region = REGION_SELECTED.name;
    }

    let provincias = this.PROVINCIAS.filter((provincia:any) => provincia.department_id == REGION_ID);
    this.PROVINCIA_SELECTEDS = provincias;
    console.log(provincias);
  }

  changeProvincia($event: any)
  {
    console.log($event.target.value);
    let PROVINCIA_ID = $event.target.value;
    //let PROVINCIA_SELECTED = this.PROVINCIAS.find((prov:any)=>prov.id = PROVINCIA_ID);
    let PROVINCIA_SELECTED = this.PROVINCIAS.find((prov:any)=>prov.id === PROVINCIA_ID);
    if(PROVINCIA_SELECTED)
    {
      this.provincia = PROVINCIA_SELECTED.name;
    }
    let distritos = this.DISTRITOS.filter((distrito:any) => distrito.province_id == PROVINCIA_ID);
    this.DISTRITOS_SELECTEDS = distritos;
    console.log(distritos);
  }

  //INICIO DE FUNCIONES PARA LOS CLIENTES
  searchClients(event?: Event)
  {
    if (event)
    {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('🔍 Buscando Clientes - Solo clientes');
    console.log('📝 Datos:', {
      n_document: this.n_document,
      full_name: this.full_name,
      phone: this.phone
    });

    if(!this.n_document && !this.full_name && !this.phone)
    {
      this.toast.error('Error', 'Se necesita alguno de los campos de búsqueda para CLIENTES.');
      return;
    }
    console.log('Buscando Clientes');
    this.proformaService.searchClients(this.n_document, this.full_name, this.phone).subscribe((resp:any)=>{
      console.log('Respuesta del servicio:', resp);
      if(resp.clients.length > 1)
      {
        this.openSelectedClients(resp.clients);
        this.toast.success('Éxito', 'Varias coincidencias encontradas');
      }
      else
      {
        if (resp.clients.length == 1)
        {
          this.CLIENT_SELECTED = resp.clients[0];
          this.openSelectedClients(resp.clients);
        }
        else
        {
          this.toast.error('Validación', 'NO HAY COINCIDENCIAS EN LA BÚSQUEDA');
        }
      }
    });
  }

  createClientPerson()
  {
    const modalRef = this.modalService.open(CreateClientsPersonComponent, { size: 'xl', centered: true });

    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;

    modalRef.componentInstance.ClientsC.subscribe((client:any) =>{
      this.CLIENT_SELECTED = client;
      this.n_document = this.CLIENT_SELECTED.n_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone = this.CLIENT_SELECTED.phone;

      this.isLoadingProcess();
    });
  }

  createClientCompany()
  {
    const modalRef = this.modalService.open(CreateClientsCompanyComponent, { size: 'xl', centered: true });

    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;

    modalRef.componentInstance.ClientsC.subscribe((client:any) =>{
      this.CLIENT_SELECTED = client;
      this.n_document = this.CLIENT_SELECTED.n_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone = this.CLIENT_SELECTED.phone;

      this.isLoadingProcess();
    });
  }

  openSelectedClients(clients:any = [])
  {
    const modalRef = this.modalService.open(SearchClientsComponent, { size: 'xl', centered: true });
    modalRef.componentInstance.clients = clients;

    modalRef.componentInstance.ClientSelected.subscribe((client:any)=>
    {
      console.log('Cliente seleccionado:', client);
      this.CLIENT_SELECTED = client;
      this.updateClientFields();
      this.toast.success('Éxito', 'Se seleccionó al cliente: ' + this.CLIENT_SELECTED.full_name);
      this.cdr.detectChanges();
    });
  }

  updateClientFields() {
    if (this.CLIENT_SELECTED) {
      this.n_document = this.CLIENT_SELECTED.n_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone = this.CLIENT_SELECTED.phone;
      // Si hay más campos, actualizarlos aquí
    }
  }

  resetClient()
  {
    this.CLIENT_SELECTED = null;
    this.n_document = '';
    this.full_name = '';
    this.phone = '';
    this.isLoadingProcess();
  }
  //FIN DE FUNCIONES PARA LOS CLIENTES

  //INICIO DE FUNCIONES PARA LOS PRODUCTOS
  searchProducts(event?: Event)
  {
    if (event)
    {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('🔍 Buscando Productos - Solo productos');
    console.log('📝 Dato:', this.search_product);

    if(!this.search_product)
    {
      this.toast.error('Error', 'Se necesita alguno de los campos de búsqueda para PRODUCTOS.');
      return;
    }
    console.log('Buscando productos');
    this.proformaService.searchProducts(this.search_product).subscribe((resp:any)=>{
      console.log('Respuesta del servicio:', resp);
      if(resp.products.data.length > 1)
      {
        this.openSelectedProducts(resp.products.data);
        this.toast.success('Éxito', 'Varias coincidencias encontradas');
      }
      else
      {
        if (resp.products.data.length == 1)
        {
          this.PRODUCT_SELECTED = resp.products.data[0];
          this.openSelectedProducts(resp.products.data);
          //this.openSelectedProducts(resp.products.data);
          //this.toast.success('Éxito', 'Se seleccionó el producto correctamente:');
        }
        else
        {
          this.toast.error('Validación', 'NO HAY COINCIDENCIAS EN LA BÚSQUEDA');
        }
      }
    });
  }

  openSelectedProducts(products:any = [])
  {
    const modalRef = this.modalService.open(SearchProductsComponent, { size: 'xl', centered: true });
    modalRef.componentInstance.products = products;

    modalRef.componentInstance.ProductSelected.subscribe((product:any)=>
    {
      this.PRODUCT_SELECTED = product;
      this.updateProductFields();
      this.toast.success('Éxito', 'Se seleccionó el producto: ' + this.PRODUCT_SELECTED.title + ' correctamente.');
      this.cdr.detectChanges();
    });
  }

  updateProductFields()
  {
    if (this.PRODUCT_SELECTED)
    {
      this.search_product = this.PRODUCT_SELECTED.title;
      
      // ✅ Establecer el descuento mínimo cuando se selecciona el producto
      this.amount_discount = this.PRODUCT_SELECTED.min_discount || 0;

      // Si hay unidades, seleccionar la primera por defecto
      if (this.PRODUCT_SELECTED.units && this.PRODUCT_SELECTED.units.length > 0)
      {
          // No seleccionar automáticamente para que el usuario elija
      }
      
      // ✅ Forzar detección de cambios
      this.cdr.detectChanges();
    }
  }

  // Propiedad computada
  get isUnitSelectDisabled(): boolean
  {
    return !this.CLIENT_SELECTED || !this.PRODUCT_SELECTED;
  }

  // También puedes agregar un mensaje descriptivo
  get unitSelectDisabledMessage(): string
  {
    if (!this.CLIENT_SELECTED && !this.PRODUCT_SELECTED) {
      return '⚠️ Selecciona un cliente y un producto primero';
    }
    if (!this.CLIENT_SELECTED) {
      return '⚠️ Selecciona un cliente primero';
    }
    if (!this.PRODUCT_SELECTED) {
      return '⚠️ Selecciona un producto primero';
    }
    return '';
  }

  changeUnitProduct($event: any)
  {

    // Validaciones iniciales
    // Validación rápida - si no hay cliente, no hacer nada
    if (!this.CLIENT_SELECTED)
    {
      this.toast.warning('Validación', 'Primero debes seleccionar un cliente.');
      // Resetear el select al valor por defecto
      this.unidad_product = '';
      this.price = this.PRODUCT_SELECTED?.price_general || 0;
      return;
    }

    // Validación rápida - si no hay producto, no hacer nada
    if (!this.PRODUCT_SELECTED)
    {
      this.toast.warning('Validación', 'Primero debes seleccionar un producto.');
      this.unidad_product = '';
      this.price = 0;
      return;
    }

    // Obtener el valor seleccionado y convertirlo a número correctamente
    let UNIT_SELECTED = Number($event.target.value);
    this.warehouses_product = this.PRODUCT_SELECTED.warehouses.filter((wareh:any) => wareh.unit.id == UNIT_SELECTED);
    this.exists_warehouse = this.warehouses_product.filter((wareh:any) => wareh.warehouse.sucursale_id == this.sucursale_asesor);

    if (!UNIT_SELECTED || isNaN(UNIT_SELECTED))
    {
      this.price = this.PRODUCT_SELECTED.price_general || 0;
      return;
    }

    // Obtener wallets del producto
    const WALLETS = this.PRODUCT_SELECTED.wallets || [];

    // Verificar si es Super Admin (rol_id = 1)
    const isSuperAdmin = this.user?.rol_id === 1;

    let priceFound = null;
    let priceFoundDetails = '';

    // 1. Búsqueda por UNIDAD + SUCURSAL + SEGMENTO (Mayor prioridad)
    priceFound = WALLETS.find((wallet: any) => {
      const unitId = Number(wallet.unit?.id);
      const sucursalId = Number(wallet.sucursale?.id);
      const segmentId = Number(wallet.client_segment?.id);
      const clientSegmentId = Number(this.CLIENT_SELECTED.client_segment?.id);

      return unitId === UNIT_SELECTED &&
        sucursalId === this.sucursale_asesor &&
        segmentId === clientSegmentId;
    });

    if (priceFound)
    {
      this.price = priceFound.price_general;
      priceFoundDetails = 'UNIDAD + SUCURSAL + SEGMENTO';
      return;
    }

    // 2. Búsqueda por UNIDAD + SUCURSAL (sin segmento)
    priceFound = WALLETS.find((wallet: any) => {
      const unitId = Number(wallet.unit?.id);
      const sucursalId = Number(wallet.sucursale?.id);
      const hasSegment = wallet.client_segment !== null &&
                        wallet.client_segment !== undefined &&
                        wallet.client_segment?.id !== null;

      return unitId === UNIT_SELECTED &&
        sucursalId === this.sucursale_asesor &&
        !hasSegment;
    });

    if (priceFound)
    {
      this.price = priceFound.price_general;
      priceFoundDetails = 'UNIDAD + SUCURSAL (sin segmento)';
      return;
    }

    // 3. Búsqueda por UNIDAD + SEGMENTO (sin sucursal)
    priceFound = WALLETS.find((wallet: any) => {
      const unitId = Number(wallet.unit?.id);
      const hasSucursal = wallet.sucursale !== null &&
                          wallet.sucursale !== undefined &&
                          wallet.sucursale?.id !== null;
      const segmentId = Number(wallet.client_segment?.id);
      const clientSegmentId = Number(this.CLIENT_SELECTED.client_segment?.id);

      return unitId === UNIT_SELECTED &&
        !hasSucursal &&
        segmentId === clientSegmentId;
    });

    if (priceFound)
    {
      this.price = priceFound.price_general;
      priceFoundDetails = 'UNIDAD + SEGMENTO (sin sucursal)';
      this.verifiedDiscount();
      return;
    }

    // 4. Búsqueda por UNIDAD (sin sucursal ni segmento)
    priceFound = WALLETS.find((wallet: any) => {
      const unitId = Number(wallet.unit?.id);
      const hasSucursal = wallet.sucursale !== null &&
                          wallet.sucursale !== undefined &&
                          wallet.sucursale?.id !== null;
      const hasSegment = wallet.client_segment !== null &&
                        wallet.client_segment !== undefined &&
                        wallet.client_segment?.id !== null;

      return unitId === UNIT_SELECTED &&
      !hasSucursal &&
      !hasSegment;
    });

    if (priceFound)
    {
      this.price = priceFound.price_general;
      priceFoundDetails = 'UNIDAD (sin sucursal ni segmento)';
      this.verifiedDiscount();
      return;
    }

    // 5. Precio base del producto (Última opción)
    this.price = this.PRODUCT_SELECTED.price_general || 0;
    this.verifiedDiscount();
  }

  // Método para obtener el descuento mínimo
  getMinDiscount(): number
  {
    return this.PRODUCT_SELECTED.min_discount;
  }

  // Método para obtener el descuento máximo
  getMaxDiscount(): number
  {
    //return (this.PRODUCT_SELECTED.max_discount * 0.01) * this.price;
    return this.PRODUCT_SELECTED.max_discount;
  }

  // Método para calcular el porcentaje de la barra
  getDiscountPercentage(): number
  {
    const maxDiscount = this.getMaxDiscount();
    if (maxDiscount === 0) return 0;
    const percentage = (this.amount_discount / maxDiscount) * 100;
    return Math.min(percentage, 100); // No superar el 100%
  }

  //FUNCIÓN PARA OBTENER EL PRECIO UNITARIO
  getUnitPrice(): number
  {
    let precio = this.price - this.getDiscount();
    return precio;
  }
  
  //FUNCIÓN PARA OBTENER EL DESCUENTO POR UNIDAD
  getDiscount(): number
  {
    let discount = this.price*(this.amount_discount/100);
    return discount;
  }

  getIvaPercentage(): number
  {
    //DEVUELVE EL IMPUESTO DEL PRODUCTO
    let iva = this.PRODUCT_SELECTED.importe_iva;
    let percentage = iva * 0.01;
    
    return percentage;
  }

  // Método para asignar clases de color a la barra
  getProgressBarClass(): string
  {
    const percentage = this.getDiscountPercentage();
    if (percentage === 0) return 'bg-secondary';
    if (percentage <= 30) return 'bg-success';
    if (percentage <= 70) return 'bg-warning';
    if (percentage <= 90) return 'bg-primary';
    return 'bg-success'; // Más del 90% es peligroso
  }
  
  // Manejar cambios en tiempo real
  onDiscountChange(): void
  {
    // Obtener los valores mínimo y máximo
    const minDiscount = this.getMinDiscount();
    const maxDiscount = this.getMaxDiscount();
    
    // ✅ IMPORTANTE: Asegurar que amount_discount sea un número
    if (this.amount_discount === null || this.amount_discount === undefined || isNaN(this.amount_discount)) {
      this.amount_discount = minDiscount;
      return;
    }

    // ✅ Validación del mínimo
    if (this.amount_discount < minDiscount) {
      this.amount_discount = minDiscount;
      this.toast.warning('Advertencia', `El descuento mínimo permitido es ${minDiscount}%`);
    }
    
    // ✅ Validación del máximo
    if (this.amount_discount > maxDiscount) {
      this.amount_discount = maxDiscount;
      this.toast.warning('Advertencia', `El descuento máximo permitido es ${maxDiscount}%`);
    }
  }

  // Método mejorado para manejar cambios en el modelo
  onDiscountModelChange(): void
  {
    const minDiscount = this.getMinDiscount();
    const maxDiscount = this.getMaxDiscount();
    
    console.log('🔄 Valor actual del descuento:', this.amount_discount);
    console.log('📊 Mínimo:', minDiscount, 'Máximo:', maxDiscount);
    
    // Validar que sea un número válido
    if (this.amount_discount === null || 
        this.amount_discount === undefined || 
        isNaN(this.amount_discount)) {
      this.amount_discount = minDiscount;
      this.toast.warning('Advertencia', `El descuento mínimo permitido es ${minDiscount}%`);
      this.cdr.detectChanges();
      return;
    }

    // ✅ Validación del mínimo
    if (this.amount_discount < minDiscount) {
      this.amount_discount = minDiscount;
      this.toast.warning('Advertencia', `El descuento mínimo permitido es ${minDiscount}%`);
      // ✅ FORZAR ACTUALIZACIÓN VISUAL
      this.cdr.detectChanges();
      return;
    }
    
    // ✅ Validación del máximo
    if (this.amount_discount > maxDiscount) {
      this.amount_discount = maxDiscount;
      this.toast.warning('Advertencia', `El descuento máximo permitido es ${maxDiscount}%`);
      this.cdr.detectChanges();
      return;
    }
  }

  // Método para manejar cuando el input queda vacío
  onDiscountInput(event: any): void
  {
    const value = event.target.value;
    
    // Si el usuario borra todo el contenido, restaurar al mínimo
    if (value === '' || value === null || value === undefined) {
      this.amount_discount = this.getMinDiscount();
      this.cdr.detectChanges();
      return;
    }
    
    // Si el valor no es un número válido, restaurar al mínimo
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      this.amount_discount = this.getMinDiscount();
      this.cdr.detectChanges();
      return;
    }
    
    // Si el valor es válido, aplicar las validaciones normales
    this.onDiscountChange();
  }

  onDiscountBlur(): void
  {
    const minDiscount = this.getMinDiscount();
    const maxDiscount = this.getMaxDiscount();
    
    console.log('👀 Blur - Validando descuento...');
    console.log('Valor actual:', this.amount_discount);
    
    if (this.amount_discount === null || 
        this.amount_discount === undefined || 
        isNaN(this.amount_discount)) {
      this.amount_discount = minDiscount;
      this.toast.warning('Validación', `El descuento se ha ajustado al mínimo permitido (${minDiscount}%)`);
      this.cdr.detectChanges();
      return;
    }
    
    if (this.amount_discount < minDiscount) {
      this.amount_discount = minDiscount;
      this.toast.warning('Validación', `El descuento se ha ajustado al mínimo permitido (${minDiscount}%)`);
      this.cdr.detectChanges();
      return;
    }
    
    if (this.amount_discount > maxDiscount) {
      this.amount_discount = maxDiscount;
      this.toast.warning('Validación', `El descuento se ha ajustado al máximo permitido (${maxDiscount}%)`);
      this.cdr.detectChanges();
      return;
    }
    
    // Forzar actualización de la vista
    this.cdr.detectChanges();
  }

  forceDiscountUpdate(): void
  {
    // Pequeño truco: cambiar y restaurar el valor para forzar la actualización
    const currentValue = this.amount_discount;
    this.amount_discount = currentValue + 0.1;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.amount_discount = currentValue;
      this.cdr.detectChanges();
    }, 10);
  }

  onDiscountKeydown(event: KeyboardEvent): void
  {
    // Obtener el valor actual del input
    const input = event.target as HTMLInputElement;
    const currentValue = parseFloat(input.value);
    const minDiscount = this.getMinDiscount();
    
    // Si el usuario intenta escribir un número menor al mínimo, mostrar advertencia
    if (event.key === 'Enter' || event.key === 'Tab')
    {
      // Validar al presionar Enter o Tab
      setTimeout(() => {
        if (this.amount_discount < minDiscount)
        {
          this.amount_discount = minDiscount;
          this.toast.warning('Validación', `Se ha ajustado al descuento mínimo que es del  ${minDiscount}%`);
          this.cdr.detectChanges();
        }
      }, 10);
    }
  }

  // Método verificado mejorado
  verifiedDiscount(): void
  {
    const MIN_DISCOUNT_REAL = this.getMinDiscount();
    const MAX_DISCOUNT_REAL = this.getMaxDiscount();

    console.log('🔍 Verificando descuento...');
    console.log('Valor actual:', this.amount_discount);
    console.log('Mínimo:', MIN_DISCOUNT_REAL, 'Máximo:', MAX_DISCOUNT_REAL);

    // ✅ Validación del mínimo (PRIMERO)
    if (this.amount_discount < MIN_DISCOUNT_REAL)
    {
      this.amount_discount = MIN_DISCOUNT_REAL;
      this.toast.error('Validación', `El descuento no puede ser menor al mínimo permitido (${MIN_DISCOUNT_REAL}%)`);
      // ✅ FORZAR ACTUALIZACIÓN VISUAL
      this.cdr.detectChanges();
      return;
    }

    // ✅ Validación del máximo (SEGUNDO)
    if (this.amount_discount > MAX_DISCOUNT_REAL)
    {
      this.amount_discount = MAX_DISCOUNT_REAL;
      this.toast.error('Validación', `El descuento no puede ser mayor al máximo permitido (${MAX_DISCOUNT_REAL}%)`);
      this.cdr.detectChanges();
      return;
    }

    // ✅ Si el valor es válido, no hacer nada
    this.cdr.detectChanges();
  }

  addProduct()
  {
    if(!this.PRODUCT_SELECTED)
    {
      this.toast.error('Validación', 'No hay seleccionado ningún producto.');
      return;
    }
    if(this.price == 0)
    {
      this.toast.error('Validación', 'No hay precio seleccionado para el producto.');
      return;
    }
    
    if(this.quantity_product == 0)
    {
      this.toast.error('Validación', 'No hay cantidad seleccionada para el producto.');
      return;
    }

    if(!this.unidad_product)
    {
      this.toast.error('Validación', 'No hay unidad seleccionada para el producto.');
      return;
    }

    //AQUÍ VERIFICO SI HAY EXISTENCIAS DE LAS UNIDADES SELECCIONADAS EN EL ALMACÉN INDICADO
    if(this.PRODUCT_SELECTED && this.PRODUCT_SELECTED.disponibilidad)
    {
      if( (this.unidad_product && this.warehouses_product.length == 0) ||
        (this.unidad_product && this.warehouses_product.length > 0 && this.exists_warehouse.length == 0) )
      {
        this.toast.error('Perfecto', 'No hay existencias disponibles para agregar el producto.');
        return
      }
    }
    
    //let SUBTOTAL = this.price - this.getDiscount();
    let CANIMPUESTO = this.getUnitPrice() * this.getIvaPercentage(); //ES LO QUE SE LE AÑADE A CADA PRODUCTO DE IMPUESTOS
    let SUBTOTAL = this.getUnitPrice() + (CANIMPUESTO);
    let UNIDAD = this.PRODUCT_SELECTED.units.find((item:any)=> item.id == this.unidad_product);
    let TOTAL = ((this.getUnitPrice() + ((this.getUnitPrice() * (this.getIvaPercentage())))) * this.quantity_product);
    let IMPUESTO = this.getIvaPercentage(); //ES EL IMPUESTO EN PORCENTAJE

    // ✅ Encontrar el almacén seleccionado
    let ALMACEN_SELECTED = null;
    if (this.almacen_product)
    {
      ALMACEN_SELECTED = this.warehouses_product.find((item:any) => item.id == this.almacen_product);
    }

    //SE AÑADEN LOS PRODUCTOS AL DETALLADO DE LA PROFORMA
    this.DETAIL_PROFORMAS.push({
      product: this.PRODUCT_SELECTED,
      description: this.description_product,
      unidad_product: this.unidad_product,
      unit: UNIDAD,
      quantity: this.quantity_product,
      price_unit: this.price,
      discount: this.amount_discount, // ← Cambiar: guardar el porcentaje en lugar del valor en euros
      discount_amount: this.getDiscount(), // ← Opcional: guardar el valor en euros si lo necesitas
      almacen_product: this.almacen_product, // ✅ ID del almacén seleccionado
      warehouse: ALMACEN_SELECTED, // ✅ Objeto completo del almacén (opcional)
      subtotal: SUBTOTAL,
      impuesto: IMPUESTO, // EN PORCENTAJE
      canimpuesto: CANIMPUESTO, // EN MONEDA
      total: TOTAL,
    });
    this.resetProduct();
    this.sumTotalDetail(); // SE CALCULA CADA VEZ QUE SE AÑADE UN PRODUCTO AL DETALLADO
  }

  sumTotalDetail()
  {
    //LA FUNCIÓN reduce NOS PERMITE SUMARN EN BASE A UN CAMPO QUE TENGA EL ARRAY DE OBJETOS
      //SE LE PASAN DOS PARÁMETROS, LA SUMA Y EL OBJETO ITERADOR
    this.TOTAL_PROFORMA = Math.round(this.DETAIL_PROFORMAS.reduce((sum:number, current:any) => sum+current.total,0));
    this.TOTAL_IMPUESTO_PROFORMA = Math.round(this.DETAIL_PROFORMAS.reduce((sum:number, current:any) => sum+current.canimpuesto,0));
    this.DEBT_PROFORMA = this.TOTAL_PROFORMA - this.PAID_OUT_PROFORMA;
    //PAID_OUT_PROFORMA

    this.isLoadingProcess();
  }

  resetProduct()
  {
    console.log('🚀 RESET PRODUCT - Iniciando...');
    console.log('📦 Producto antes:', this.PRODUCT_SELECTED);

    this.PRODUCT_SELECTED = null;
    this.search_product = '';
    this.price = 0;
    this.quantity_product = 0;
    this.warehouses_product = [];
    this.amount_discount = 0;
    this.description_product = '';
    this.unidad_product = '';
    this.almacen_product = '';
    this.exists_warehouse = []; // ✅ Agrega esta línea

    console.log('✅ Producto reseteado');
    console.log('📦 Producto después:', this.PRODUCT_SELECTED);

    this.isLoadingProcess();

    // ✅ Forzar actualización de la vista
    this.cdr.detectChanges();

    // ✅ Mostrar mensaje de éxito
    this.toast.success('Éxito', 'Producto reseteado correctamente');
  }

  editProduct(DETAIL_PROFOR:any, INDEX:number)
  {
    const modalRef = this.modalService.open(EditProductDetailProformaComponent,{size:'xl',centered:true});

    //modalRef.componentInstance.DETAIL_PRODUCT = DETAIL_PROFOR;
    
    modalRef.componentInstance.DETAIL_PRODUCT = {...DETAIL_PROFOR};
    modalRef.componentInstance.sucursale_asesor = this.sucursale_asesor;
    modalRef.componentInstance.CLIENT_SELECTED = this.CLIENT_SELECTED;
    modalRef.componentInstance.user = this.proformaService.authservice.user;

    modalRef.componentInstance.EditProductProforma.subscribe((product_edit:any) => {
      
      console.log('🔄 Producto editado recibido:', product_edit);
      
      this.DETAIL_PROFORMAS[INDEX] = product_edit;

      // Forzar la detección de cambios
      this.cdr.detectChanges();
      // Mostrar mensaje de éxito
      this.toast.success('Éxito', 'Producto actualizado correctamente');
      // Pequeño retraso para asegurar que la vista se actualice
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);
      
      this.isLoadingProcess();
      this.sumTotalDetail();
    });

    // Manejar el cierre del modal sin cambios
    modalRef.dismissed.subscribe(() => {
      console.log('Modal cerrado sin cambios');
    });
    
  }

  deleteProduct(DETAIL_PROFOR:any, INDEX:number)
  {
    const modalRef = this.modalService.open(DeleteProductDetailProformaComponent,{size:'xl',centered:true});

    //modalRef.componentInstance.DETAIL_PRODUCT = DETAIL_PROFOR;
    
    modalRef.componentInstance.DETAIL_PRODUCT = {...DETAIL_PROFOR};

    modalRef.componentInstance.DeleteProductProforma.subscribe((product_edit:any) => {
      
      this.DETAIL_PROFORMAS.splice(INDEX, 1) ;

      // Forzar la detección de cambios
      this.cdr.detectChanges();
      // Mostrar mensaje de éxito
      this.toast.success('Éxito', 'Producto eliminado correctamente del detallado de la proforma');
      // Pequeño retraso para asegurar que la vista se actualice
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);
      
      this.isLoadingProcess();
      this.sumTotalDetail();
    });

    // Manejar el cierre del modal sin cambios
    modalRef.dismissed.subscribe(() => {
      console.log('Modal cerrado sin cambios');
    });
  }
  
  //FIN DE FUNCIONES PARA LOS PRODUCTOS

  saveChanges()
  {
    console.log('Holaaaaaaa');
  }
}