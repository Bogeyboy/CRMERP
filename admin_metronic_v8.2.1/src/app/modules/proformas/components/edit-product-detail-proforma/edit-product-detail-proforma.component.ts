import { SearchProductsComponent } from './../search-products/search-products.component';
import { CommonModule } from '@angular/common';
import { Component, Input, inject, ChangeDetectorRef, AfterViewInit, ElementRef, ViewChildren, QueryList, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModule, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-product-detail-proforma',
  standalone: true,
  imports: [
    CommonModule,    // ✅ Para directivas como ngFor, ngIf
    FormsModule,     // ✅ Para ngModel
    NgbModule,
    SearchProductsComponent
  ],
  templateUrl: './edit-product-detail-proforma.component.html',
  styleUrl: './edit-product-detail-proforma.component.scss'
})
export class EditProductDetailProformaComponent {
  @Input() DETAIL_PRODUCT: any;
  @Input() sucursale_asesor: any;
  @Input() CLIENT_SELECTED: any;
  @Input() user: any;
  @Input() almacen_product_selected: any;

  @Output() EditProductProforma: EventEmitter<any> = new EventEmitter;

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
  isLoading = false;

  constructor(
    public modal: NgbActiveModal,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
  ){}
  
  isLoadingProcess() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 50);
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.PRODUCT_SELECTED = this.DETAIL_PRODUCT.product;
    this.price = this.DETAIL_PRODUCT.price_unit;
    this.quantity_product = this.DETAIL_PRODUCT.quantity;
    this.unidad_product = this.DETAIL_PRODUCT.unidad_product;
    this.description_product = this.DETAIL_PRODUCT.description;
    //this.exists_warehouse  = this.DETAIL_PRODUCT
    this.warehouses_product = this.PRODUCT_SELECTED.warehouses.filter((wareh:any) => wareh.unit.id == this.unidad_product);
    this.exists_warehouse = this.warehouses_product.filter((wareh:any) => wareh.warehouse.sucursale_id == this.sucursale_asesor);
    
    // ✅ Establecer el almacén seleccionado
    if (this.DETAIL_PRODUCT.almacen_product)
    {
      this.almacen_product = this.DETAIL_PRODUCT.almacen_product;
    }
    else if (this.DETAIL_PRODUCT.warehouse)
    {
      this.almacen_product = this.DETAIL_PRODUCT.warehouse.id;
    }
    else if (this.exists_warehouse && this.exists_warehouse.length > 0)
    {
      // Si no hay almacén seleccionado, seleccionar el primero disponible
      this.almacen_product = this.exists_warehouse[0].id;
    }

    this.amount_discount = this.DETAIL_PRODUCT.discount || 0;

    console.log('Descuento (porcentaje): ' + this.amount_discount);
    console.log('Almacén seleccionado:', this.almacen_product);
    console.log('Warehouses disponibles:', this.warehouses_product);
    
  }

  changeUnitProduct($event: any)
  {
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
    //return (this.PRODUCT_SELECTED.min_discount * 0.01) * this.price;
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

  
  /* onDiscountChange(): void
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
  } */
  
  
  
  
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

  edit()
  {

    // Validar que todos los campos necesarios estén completos
    if (!this.quantity_product || this.quantity_product <= 0) {
      this.toast.error('Validación', 'La cantidad debe ser mayor a 0');
      return;
    }

    if (!this.unidad_product) {
      this.toast.error('Validación', 'Debes seleccionar una unidad');
      return;
    }

    const updatedProduct = {
      ...this.DETAIL_PRODUCT,
      discount: this.amount_discount,
      subtotal: (this.getUnitPrice() + (this.getUnitPrice() * (this.getIvaPercentage()))).toFixed(2),
      total: ((this.getUnitPrice() + ((this.getUnitPrice() * (this.getIvaPercentage())))) * this.quantity_product).toFixed(2),
      impuesto: this.getIvaPercentage(),
      quantity: this.quantity_product,
      unit: this.PRODUCT_SELECTED.units.find((item:any)=> item.id == this.unidad_product),
      unidad_product: this.unidad_product,
      description: this.description_product,
      price_unit: this.price, // Asegurar que se actualiza el precio unitario
      discount_amount: this.getDiscount(), // Guardar el valor del descuento en euros
    };

    // Emitir el producto actualizado
    this.EditProductProforma.emit(updatedProduct);

    // Cerrar el modal
    this.modal.close();

  }
}
