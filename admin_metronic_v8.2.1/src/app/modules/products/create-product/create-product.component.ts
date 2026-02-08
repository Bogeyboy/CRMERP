import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  isLoading$:any;
  is_discount = 1;
  tab_selected = 1;

  //SECCION GENERAL
  title = '';
  description = '';
  //PROVEEDOR Y ESPECIFICACIONES
  provider_id = 0;
  key_v = '';
  value_v = '';
  //SECCIÓN IMAGEN DE PRODUCTO
  imagen_product:any;
  imagen_previzualiza:any = 'assets/media/svg/files/blank-image.svg';
  //SECCIÓN ADICIONALES
  price_general = 0;
  disponibilidad = '';
  tiempo_de_abastecimiento = 0;
  min_discount = 0;
  max_discount = 0;
  tax_selected = '1';
  importe_iva = 0;
  //SECCIÓN ESTADO DE PRODUCTO
  state = '1';
  //SECCIÓN CATEGORÍA DE PRODUCTO
  product_categorie_id = '';

  //PESTAÑA ADVANCED
  //SECCIÓN INVENTARIO
  sku = '';
  is_gift = 1;
  umbral = 0;
  umbral_unit_id = '';

  //SECCIÓN SHIPPING
  weight = 0;
  width = 0;
  height = 0;
  length = 0;


  // SECTION WAREHOUSES
  almacen_warehouse = '';
  unit_warehouse = '';
  quantity_warehouse = 0;
  // LISTA DE EXISTENCIAS DEL PRODUCTO , DANDO UN ALMACEN Y UNA UNIDAD
  WAREHOUSES_PRODUCT:any = [];
  // SECTION PRICE MULTIPLES
  unit_price_multiple = '';
  sucursale_price_multiple = '';
  client_segment_price_multiple = '';
  quantity_price_multiple = 0;
  WALLETS_PRODUCT:any = [];

  WAREHOUSES:any = [];
  SUCURSALES:any = [];
  PROVIDERS:any = [];
  UNITS:any = [];
  CLIENT_SEGMENTS:any = [];
  CATEGORIES:any = [];

  PRODUCT_ID = '';
  PRODUCT_SELECTED: any = null;
  ESPECIFICACIONES: any = [];

  constructor(
    public toast:ToastrService,
    public productService: ProductsService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;

    this.productService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.WAREHOUSES = resp.almacenes;
      this.SUCURSALES = resp.sucursales;
      this.UNITS = resp.units;
      this.CLIENT_SEGMENTS = resp.segments_clients;
      this.CATEGORIES = resp.categories;
      this.PROVIDERS = resp.providers;
    })
  }

  addWarehouse(){
    if(!this.almacen_warehouse || !this.unit_warehouse  || !this.quantity_warehouse)
    {
      this.toast.error("VALIDACIÓN","Necesitas seleccionar un almacen y una unidad, aparte de colocar la cantidad");
      return;
    }

    const UNIT_SELECTED = this.UNITS.find((unit:any) => unit.id == this.unit_warehouse);
    const WAREHOUSE_SELECTED = this.WAREHOUSES.find((wareh:any) => wareh.id == this.almacen_warehouse);

    const INDEX_WAREHOUSE = this.WAREHOUSES_PRODUCT.findIndex((wh_prod:any) => (wh_prod.unit.id == this.unit_warehouse)
                                                                            && (wh_prod.warehouse.id == this.almacen_warehouse));

    if(INDEX_WAREHOUSE != -1)
    {
      this.toast.error("VALIDACIÓN","La existencia de ese producto con el almacen y la unidad ya existe");
      return;
    }
    this.WAREHOUSES_PRODUCT.push({
      unit: UNIT_SELECTED,
      warehouse: WAREHOUSE_SELECTED,
      quantity: this.quantity_warehouse,
    });
    this.almacen_warehouse = ''
    this.unit_warehouse = ''
    this.quantity_warehouse = 0

    console.log(this.WAREHOUSES_PRODUCT);
  }

  addEspecif() {
    if (!this.key_v || !this.value_v)
    {
      this.toast.error("VALIDACIÓN", "Necesitas introducir una propiedad y su correspondiente valor");
      return;
    }
    this.ESPECIFICACIONES.unshift({
      key_v: this.key_v,
      value_v: this.value_v
    });
    this.key_v = '';
    this.value_v = '';
  }

  removeEspecif(i: number) {
    this.ESPECIFICACIONES.splice(i, 1);
  }

  removeWarehouse(WAREHOUSES_PROD:any){
    // EL OBJETO QUE QUIERO ELIMINAR
    // LA LISTA DONDE SE ENCUENTRA EL OBJECTO QUE QUIERO ELIMINAR
    //  OBTENER LA POSICIÓN DEL ELEMENTO A ELIMINAR
    const INDEX_WAREHOUSE = this.WAREHOUSES_PRODUCT.findIndex((wh_prod:any) => (wh_prod.unit.id == WAREHOUSES_PROD.unit.id)
      && (wh_prod.warehouse.id == WAREHOUSES_PROD.warehouse.id));
    //  LA ELIMINACIÓN DEL OBJECTO
    if(INDEX_WAREHOUSE != -1){
      this.WAREHOUSES_PRODUCT.splice(INDEX_WAREHOUSE,1);
    }
  }

  addPriceMultiple(){
    if(!this.unit_price_multiple || ! this.quantity_price_multiple)
    {
      this.toast.error("VALIDACIÓN","Necesitas seleccionar una unidad, aparte de colocar un precio");
      return;
    }
    // unit_price_multiple
    // sucursale_price_multiple
    // client_segment_price_multiple
    // quantity_price_multiple
    const UNIT_SELECTED = this.UNITS.find((unit:any) => unit.id == this.unit_price_multiple);
    const SUCURSALE_SELECTED = this.SUCURSALES.find((sucurs:any) => sucurs.id == this.sucursale_price_multiple);
    const CLIENT_SEGMENT_SELECTED = this.CLIENT_SEGMENTS.find((clisg:any) => clisg.id == this.client_segment_price_multiple);

    const INDEX_PRICE_MULTIPLE = this.WALLETS_PRODUCT.findIndex((wh_prod:any) =>
                          (wh_prod.unit.id == this.unit_price_multiple)
                          && (wh_prod.sucursale_price_multiple == this.sucursale_price_multiple)
                          && (wh_prod.client_segment_price_multiple == this.client_segment_price_multiple));

    if(INDEX_PRICE_MULTIPLE != -1){
      this.toast.error("VALIDACIÓN","El precio de ese producto con la sucursal y unidad ya existe");
      return;
    }

    this.WALLETS_PRODUCT.push({
      unit: UNIT_SELECTED,
      sucursale: SUCURSALE_SELECTED,
      client_segment: CLIENT_SEGMENT_SELECTED,
      //price_general: this.quantity_price_multiple,
      price: this.quantity_price_multiple,
      quantity: this.quantity_price_multiple,
      sucursale_price_multiple: this.sucursale_price_multiple,
      client_segment_price_multiple: this.client_segment_price_multiple,
    });
    this.quantity_price_multiple = 0;
    this.sucursale_price_multiple = ''
    this.client_segment_price_multiple = '';
    this.unit_price_multiple = '';

    console.log(this.WALLETS_PRODUCT);
    //const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //console.log(timeZone);
  }

  removePriceMultiple(WALLETS_PROD:any){
    // EL OBJETO QUE QUIERO ELIMINAR
    // LA LISTA DONDE SE ENCUENTRA EL OBJECTO QUE QUIERO ELIMINAR
    //  OBTENER LA POSICIÓN DEL ELEMENTO A ELIMINAR
    const INDEX_WALLETS_PROD = this.WALLETS_PRODUCT.findIndex((wh_prod:any) =>
      (wh_prod.unit.id == WALLETS_PROD.unit.id)
      && (wh_prod.sucursale_price_multiple == WALLETS_PROD.sucursale_price_multiple)
      && (wh_prod.client_segment_price_multiple == WALLETS_PROD.client_segment_price_multiple));
    //  LA ELIMINACIÓN DEL OBJECTO
    if(INDEX_WALLETS_PROD != -1){
      this.WALLETS_PRODUCT.splice(INDEX_WALLETS_PROD,1);
    }
  }

  isLoadingProcess(){
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toast.warning("WARN","El archivo no es una imagen");
      return;
    }
    this.imagen_product = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.imagen_product);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    this.isLoadingProcess();
  }

  isGift(){
    this.is_gift = this.is_gift == 1 ? 2 : 1;
    console.log(this.is_gift);
  }

  selectedDiscount(val:number){
    this.is_discount = val;
  }

  selectedTab(val:number){
    this.tab_selected = val;
  }

  /* store() {
    //console.log(this.disponibilidad,this.provider_id,this.tax_selected,this.is_discount,this.is_gift,this.title,this.description,this.price_general,this.imagen_product,
//      this.product_categorie_id,this.sku,this.weight,this.width,this.height,this.length, this.ESPECIFICACIONES);
    if(!this.title ||
      !this.description ||
      !this.price_general ||
      !this.imagen_product ||
      !this.product_categorie_id ||
      !this.sku ||
      !this.tax_selected ||
      !this.importe_iva ||
      !this.weight  ||
      !this.width  ||
      !this.height  ||
      !this.length ||
      !this.provider_id
    ){
      this.toast.error("VALIDACIÓN","Necesitas llenar todos los campos obligatorios");
      return;
    }
    if(this.WAREHOUSES_PRODUCT.length == 0){
      this.toast.error("VALIDACIÓN","Necesitas ingresar al menos un registro de existencia de producto");
      return;
    }
    if(this.WALLETS_PRODUCT.length == 0){
      this.toast.error("VALIDACIÓN","Necesitas ingresar al menos un listado de precio al producto");
      return;
    }

    //ELIMINAR LUEGO
    console.log('WAREHOUSES_PRODUCT estructura completa:', this.WAREHOUSES_PRODUCT);
    console.log('WALLETS_PRODUCT estructura completa:', this.WALLETS_PRODUCT);

    //ELIMINAR LUEGO
    if (this.WAREHOUSES_PRODUCT.length > 0) {
      console.log('Primer warehouse:', this.WAREHOUSES_PRODUCT[0]);
      console.log('Tiene propiedad warehouse?:', 'warehouse' in this.WAREHOUSES_PRODUCT[0]);
      console.log('Tiene propiedad warehouse_id?:', 'warehouse_id' in this.WAREHOUSES_PRODUCT[0]);
    }
    //ELIMINAR LUEGO
    if (this.WALLETS_PRODUCT.length > 0) {
      console.log('Primer wallet:', this.WALLETS_PRODUCT[0]);
      console.log('Tiene propiedad unit?:', 'unit' in this.WALLETS_PRODUCT[0]);
      console.log('Tiene propiedad unit_id?:', 'unit_id' in this.WALLETS_PRODUCT[0]);
    }

    const warehousesData = this.WAREHOUSES_PRODUCT.map((warehouse: any) => ({
      warehouse_id: warehouse.warehouse.id,
      unit_id: warehouse.unit.id,
      quantity: warehouse.quantity
    }));

    const walletsData = this.WALLETS_PRODUCT.map((wallet: any) => {
      // Usa 'price' en lugar de 'price_general' o 'quantity'
      return {
        unit_id: wallet.unit.id,
        sucursale_id: wallet.sucursale.id,
        client_segment_id: wallet.client_segment.id,
        price: wallet.price_general || wallet.price || 0  // Asegúrate de usar 'price'
      };
    });
    //BORRAR LUEGO
    console.log('Wallets para enviar:', walletsData);

    const formData = new FormData();
    formData.append("title",this.title);
    formData.append("description",this.description);
    formData.append("specifications",JSON.stringify(this.ESPECIFICACIONES));
    formData.append("state",this.state);
    formData.append("product_categorie_id",this.product_categorie_id);
    formData.append("product_imagen",this.imagen_product);
    formData.append("provider_id",this.provider_id+"");
    formData.append("price_general",this.price_general+"");
    formData.append("disponibilidad",this.disponibilidad+"");

    //console.log('El proveedor es: ', this.provider_id);
    formData.append("tiempo_de_abastecimiento",this.tiempo_de_abastecimiento+"");
    formData.append("is_discount",this.is_discount+"");//NUEVO
    formData.append("min_discount",this.min_discount+"");
    formData.append("max_discount",this.max_discount+"");
    formData.append("tax_selected",this.tax_selected+"");//NUEVO
    formData.append("importe_iva",this.importe_iva+"");//NUEVO

    formData.append("sku",this.sku+"");
    formData.append("is_gift",this.is_gift+"");

    formData.append("weight",this.weight+"");//NUEVO
    formData.append("width",this.width+"");//NUEVO
    formData.append("height",this.height+"");//NUEVO
    formData.append("length",this.length+"");//NUEVO

    formData.append("umbral",this.umbral+"");
    formData.append("umbral_unit_id",this.umbral_unit_id);

    formData.append("warehouses", JSON.stringify(warehousesData));
    formData.append("wallets", JSON.stringify(walletsData));

    console.log('Enviando datos...');
    console.log('Warehouses:', warehousesData);
    console.log('Wallets:', walletsData);
    //formData.append("WAREHOUSES_PRODUCT",JSON.stringify(this.WAREHOUSES_PRODUCT));
    //formData.append("WALLETS_PRODUCT",JSON.stringify(this.WALLETS_PRODUCT));

    this.productService.registerProduct(formData).subscribe((resp:any) => {
      //console.log(formData);

      console.log('Respuesta completa:', resp);
      console.log('WALLETS_PRODUCT:', this.WALLETS_PRODUCT);

      if(resp.message == 200)
      {
        this.toast.success("EXITO","El producto se registro correctamente");
        this.cleanForm();
      }
      else
      {
        //this.toast.warning("VALIDACIÓN",resp.message_text);
        this.toast.warning("VALIDACIÓN", resp.message_text || resp.message || "Error al registrar el producto");
      }
      error: (error) => {
      console.error('Error en la petición:', error);
      this.toast.error("ERROR", "Ocurrió un error al registrar el producto");
    }
    });
  } */

  store() {
    console.log(this.disponibilidad,this.provider_id,this.tax_selected,this.is_discount,this.is_gift,this.title,this.description,this.price_general,this.imagen_product,
      this.product_categorie_id,this.sku,this.weight,this.width,this.height,this.length, this.ESPECIFICACIONES);

    if(!this.title ||
      !this.description ||
      !this.price_general ||
      !this.imagen_product ||
      !this.product_categorie_id ||
      !this.sku ||
      !this.tax_selected ||
      !this.importe_iva ||
      !this.weight  ||
      !this.width  ||
      !this.height  ||
      !this.length ||
      !this.provider_id
    ){
      this.toast.error("VALIDACIÓN","Necesitas llenar todos los campos obligatorios");
      return;
    }

    if(this.WAREHOUSES_PRODUCT.length == 0){
      this.toast.error("VALIDACIÓN","Necesitas ingresar al menos un registro de existencia de producto");
      return;
    }

    if(this.WALLETS_PRODUCT.length == 0){
      this.toast.error("VALIDACIÓN","Necesitas ingresar al menos un listado de precio al producto");
      return;
    }

    // CORRECTO: Warehouses ya está bien
    const warehousesData = this.WAREHOUSES_PRODUCT.map((warehouse: any) => ({
      warehouse_id: warehouse.warehouse.id,
      unit_id: warehouse.unit.id,
      quantity: warehouse.quantity
    }));

    // CORREGIDO: Wallets - usa 'price' como campo
    const walletsData = this.WALLETS_PRODUCT.map((wallet: any) => ({
      unit_id: wallet.unit.id,
      sucursale_id: wallet.sucursale.id,
      client_segment_id: wallet.client_segment.id,
      //price: wallet.price_general  // ¡IMPORTANTE! Usa price_general como 'price'
      price: wallet.price || wallet.price_general || wallet.quantity || 0
    }));

    // VERIFICA LOS DATOS ANTES DE ENVIAR
    console.log('=== DATOS PARA ENVIAR ===');
    console.log('WarehousesData:', warehousesData);
    console.log('WalletsData:', walletsData);
    console.log('Primer wallet:', walletsData[0]);
    console.log('¿Tiene propiedad price?:', walletsData[0].price !== undefined);

    const formData = new FormData();
    formData.append("title", this.title);
    formData.append("description", this.description);
    formData.append("specifications", JSON.stringify(this.ESPECIFICACIONES));
    formData.append("state", this.state);
    formData.append("product_categorie_id", this.product_categorie_id);
    formData.append("product_imagen", this.imagen_product);
    formData.append("provider_id", this.provider_id + "");
    formData.append("price_general", this.price_general + "");
    formData.append("disponibilidad", this.disponibilidad + "");
    formData.append("tiempo_de_abastecimiento", this.tiempo_de_abastecimiento + "");
    formData.append("is_discount", this.is_discount + "");
    formData.append("min_discount", this.min_discount + "");
    formData.append("max_discount", this.max_discount + "");
    formData.append("tax_selected", this.tax_selected + "");
    formData.append("importe_iva", this.importe_iva + "");
    formData.append("sku", this.sku + "");
    formData.append("is_gift", this.is_gift + "");
    formData.append("weight", this.weight + "");
    formData.append("width", this.width + "");
    formData.append("height", this.height + "");
    formData.append("length", this.length + "");
    formData.append("umbral", this.umbral + "");
    formData.append("umbral_unit_id", this.umbral_unit_id);

    // Asegúrate de que sean JSON strings válidos
    formData.append("warehouses", JSON.stringify(warehousesData));
    formData.append("wallets", JSON.stringify(walletsData));

    console.log('Enviando datos al servidor...');
    console.log('Warehouses a enviar:', warehousesData);
    console.log('Wallets a enviar:', walletsData);

    this.productService.registerProduct(formData).subscribe({
      next: (resp: any) => {
        console.log('Respuesta completa del servidor:', resp);

        // Verifica si el backend devuelve información adicional
        if (resp.wallets_created) {
          console.log('Wallets creados:', resp.wallets_created);
        }
        if (resp.warehouses_created) {
          console.log('Warehouses creados:', resp.warehouses_created);
        }

        if(resp.message == 200) {
          this.toast.success("EXITO", "El producto se registró correctamente");
          this.cleanForm();
        } else {
          this.toast.warning("VALIDACIÓN", resp.message_text || "Error al registrar el producto");
        }
      },
      error: (error) => {
        console.error('Error completo:', error);
        console.error('Error details:', error.error);
        this.toast.error("ERROR", error.error?.message_text || "Ocurrió un error al registrar el producto");
      }
    });
  }
  cleanForm(){
      this.title = '';
      this.description = ''
      this.state = '1';
      this.product_categorie_id = '';
      this.provider_id = 0;
      this.imagen_product = null;
      this.disponibilidad = '1';
      this.tiempo_de_abastecimiento = 0;
      this.is_discount = 1;
      this.min_discount = 0;
      this.max_discount = 0;
      this.tax_selected = '1';
      this.importe_iva = 0;
      this.sku = '';
      this.is_gift = 1;
      this.weight = 0;
      this.width = 0;
      this.height = 0;
      this.length = 0;
      this.umbral = 0;
      this.umbral_unit_id = '';
      this.WAREHOUSES_PRODUCT = [];
      this.WALLETS_PRODUCT = [];
      this.imagen_previzualiza = 'assets/media/svg/files/blank-image.svg';
  }
}
