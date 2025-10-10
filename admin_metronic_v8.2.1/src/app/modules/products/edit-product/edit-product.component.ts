import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  //imports: [],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
isLoading$:any;
  is_discount:number = 1;
  tab_selected:number = 1;
  
  //SECCION GENERAL
  title:string = '';
  description:string = '';
  //SECCIÓN IMAGEN DE PRODUCTO
  imagen_product:any;
  imagen_previzualiza:any = 'assets/media/svg/files/blank-image.svg';
  //SECCIÓN ADICIONALES
  
  price_general:number = 0;
  disponibilidad:string = '';
  tiempo_de_abastecimiento:number = 0;
  min_discount:number = 0;
  max_discount:number = 0;
  tax_selected:string = '1';
  importe_iva:number = 0;
  //SECCIÓN ESTADO DE PRODUCTO
  state:string = '1';
  //SECCIÓN CATEGORÍA DE PRODUCTO
  product_categorie_id:string = '';

  //PESTAÑA ADVANCED
  //SECCIÓN INVENTARIO
  sku:string = '';
  is_gift:number = 1;
  umbral:number = 0;
  umbral_unit_id:string = '';

  //SECCIÓN SHIPPING
  weight:number = 0;
  width:number = 0;
  height:number = 0;
  length:number = 0;

  key_v:string = '';
  value_v:string = '';


  // SECTION WAREHOUSES
  almacen_warehouse:string = '';
  unit_warehouse:string = '';
  quantity_warehouse:number = 0;
  // LISTA DE EXISTENCIAS DEL PRODUCTO , DANDO UN ALMACEN Y UNA UNIDAD
  WAREHOUSES_PRODUCT:any = [];
  // SECTION PRICE MULTIPLES  
  unit_price_multiple:string = '';
  sucursale_price_multiple:string = '';
  client_segment_price_multiple:string = '';
  quantity_price_multiple:number = 0;
  WALLETS_PRODUCT:any = [];

  WAREHOUSES:any = [];
  SUCURSALES:any = [];
  PROVIDERS:any = [];
  provider_id:string ='';
  
  UNITS:any = [];
  CLIENT_SEGMENTS:any = [];
  CATEGORIES:any = [];

  PRODUCT_ID:string = '';
  PRODUCT_SELECTED:any = null;

  ESPECIFICACIONES:any = [];

  constructor(
    public toast:ToastrService,
    public productService: ProductsService,
    public ActivedRoute: ActivatedRoute
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.ActivedRoute.params.subscribe((resp:any)=>{
      console.log(resp);
      this.PRODUCT_ID = resp.id;
    });
    this.isLoading$ = this.productService.isLoading$;

    this.productService.showProduct(this.PRODUCT_ID).subscribe((resp: any) => {
      console.log(resp);
      this.PRODUCT_SELECTED = resp.product;

      this.is_discount = this.PRODUCT_SELECTED.is_discount;
      this.title = this.PRODUCT_SELECTED.title;
      this.description = this.PRODUCT_SELECTED.description;
      //this.imagen_product = this.PRODUCT_SELECTED.imagen_product;
      this.imagen_previzualiza = this.PRODUCT_SELECTED.imagen;
      this.provider_id = this.PRODUCT_SELECTED.provider_id;
      this.price_general = this.PRODUCT_SELECTED.price_general;
      this.disponibilidad = this.PRODUCT_SELECTED.disponibilidad;
      this.tiempo_de_abastecimiento = this.PRODUCT_SELECTED.tiempo_de_abastecimiento;
      this.min_discount = this.PRODUCT_SELECTED.min_discount;
      this.max_discount = this.PRODUCT_SELECTED.max_discount;
      this.tax_selected = this.PRODUCT_SELECTED.tax_selected;
      this.importe_iva = this.PRODUCT_SELECTED.importe_iva;
      this.state = this.PRODUCT_SELECTED.state;
      this.product_categorie_id = this.PRODUCT_SELECTED.product_categorie_id;
      this.sku = this.PRODUCT_SELECTED.sku;
      this.is_gift = this.PRODUCT_SELECTED.is_gift;
      this.umbral = this.PRODUCT_SELECTED.umbral;
      this.umbral_unit_id = this.PRODUCT_SELECTED.umbral_unit_id;
      this.weight = this.PRODUCT_SELECTED.weight;
      this.width = this.PRODUCT_SELECTED.width;
      this.height = this.PRODUCT_SELECTED.height;
      this.length = this.PRODUCT_SELECTED.length;

      this.ESPECIFICACIONES = this.PRODUCT_SELECTED.specifications;

    });

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

    let UNIT_SELECTED = this.UNITS.find((unit:any) => unit.id == this.unit_warehouse);
    let WAREHOUSE_SELECTED = this.WAREHOUSES.find((wareh:any) => wareh.id == this.almacen_warehouse);

    let INDEX_WAREHOUSE = this.WAREHOUSES_PRODUCT.findIndex((wh_prod:any) => (wh_prod.unit.id == this.unit_warehouse)
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

  removeWarehouse(WAREHOUSES_PROD:any){
    // EL OBJETO QUE QUIERO ELIMINAR
    // LA LISTA DONDE SE ENCUENTRA EL OBJECTO QUE QUIERO ELIMINAR
    //  OBTENER LA POSICIÓN DEL ELEMENTO A ELIMINAR
    let INDEX_WAREHOUSE = this.WAREHOUSES_PRODUCT.findIndex((wh_prod:any) => (wh_prod.unit.id == WAREHOUSES_PROD.unit.id)
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
    let UNIT_SELECTED = this.UNITS.find((unit:any) => unit.id == this.unit_price_multiple);
    let SUCURSALE_SELECTED = this.SUCURSALES.find((sucurs:any) => sucurs.id == this.sucursale_price_multiple);
    let CLIENT_SEGMENT_SELECTED = this.CLIENT_SEGMENTS.find((clisg:any) => clisg.id == this.client_segment_price_multiple);
    
    let INDEX_PRICE_MULTIPLE = this.WALLETS_PRODUCT.findIndex((wh_prod:any) => 
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
      price_general: this.quantity_price_multiple,
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
    let INDEX_WALLETS_PROD = this.WALLETS_PRODUCT.findIndex((wh_prod:any) => 
      (wh_prod.unit.id == WALLETS_PROD.unit.id)
      && (wh_prod.sucursale_price_multiple == WALLETS_PROD.sucursale_price_multiple)
      && (wh_prod.client_segment_price_multiple == WALLETS_PROD.client_segment_price_multiple));
    //  LA ELIMINACIÓN DEL OBJECTO
    if(INDEX_WALLETS_PROD != -1){
      this.WALLETS_PRODUCT.splice(INDEX_WALLETS_PROD,1);
    }
  }

  addEspecif(){
    if (!this.key_v || !this.value_v) {
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

  removeEspecif(i:number){
    this.ESPECIFICACIONES.splice(i,1);
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
    let reader = new FileReader();
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

  store() {
    /* console.log(this.disponibilidad,this.provider_id,this.tax_selected,this.is_discount,this.is_gift,this.title,this.description,this.price_general,this.imagen_product,
      this.product_categorie_id,this.sku,this.weight,this.width,this.height,this.length); */
    if(!this.title ||
      !this.description ||
      !this.price_general ||
      //!this.imagen_product ||
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

    let formData = new FormData();
    formData.append("title",this.title);
    formData.append("description",this.description);
    formData.append("state",this.state);
    formData.append("product_categorie_id",this.product_categorie_id);
    if(this.imagen_product){
      formData.append("product_imagen",this.imagen_product);
    }
    formData.append("provider_id",this.provider_id+"");
    formData.append("specifications", JSON.stringify(this.ESPECIFICACIONES));
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

    
    //formData.append("WAREHOUSES_PRODUCT",JSON.stringify(this.WAREHOUSES_PRODUCT));
    //formData.append("WALLETS_PRODUCT",JSON.stringify(this.WALLETS_PRODUCT));

    this.productService.updateProduct(this.PRODUCT_ID,formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 200){
        this.toast.success("EXITO","El producto se editó correctamente");
        //this.cleanForm();
      }else{
        this.toast.warning("VALIDACIÓN",resp.message_text);
      }
    })
  }

  /* cleanForm(){
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
  } */
}
