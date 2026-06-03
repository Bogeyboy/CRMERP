import { ProductWarehousesService } from './../service/product-warehouses.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';
import { ActivatedRoute } from '@angular/router';
import { data } from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditWarehouseProductComponent } from '../warehouse/edit-warehouse-product/edit-warehouse-product.component';
import { DeleteWarehouseProductComponent } from '../warehouse/delete-warehouse-product/delete-warehouse-product.component';
import { ProductWalletsService } from '../service/product-wallets.service';
import { EditWalletPriceProductComponent } from '../wallet/edit-wallet-price-product/edit-wallet-price-product.component';
import { DeleteWalletPriceProductComponent } from '../wallet/delete-wallet-price-product/delete-wallet-price-product.component';

@Component({
  selector: 'app-edit-product',
  //imports: [],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit
{
  isLoading$:any;
  is_discount = 1;
  tab_selected = 1;

  //SECCION GENERAL
  title = '';
  description = '';
  //SECCIÓN IMAGEN DE PRODUCTO
  imagen_product:any;
  imagen_previzualiza:any = 'assets/media/svg/files/blank-image.svg';
  image_removed: boolean = false;
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

  key_v = '';
  value_v = '';


  // SECTION WAREHOUSES
  almacenes:any []= [];
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
  provider_id =0;

  UNITS:any = [];
  CLIENT_SEGMENTS:any = [];
  CATEGORIES:any = [];

  PRODUCT_ID = '';
  PRODUCT_SELECTED:any = null;

  ESPECIFICACIONES:any = [];

  constructor(
    public toast:ToastrService,
    public productService: ProductsService,
    public ActivedRoute: ActivatedRoute,
    public ProductWarehousesService: ProductWarehousesService,
    public productWalletsService: ProductWalletsService,
    public modalService: NgbModal
  ) {

  }

  ngOnInit(): void
  {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.ActivedRoute.params.subscribe((resp:any)=>
    {
      console.log(resp);
      this.PRODUCT_ID = resp.id;
    });
    this.isLoading$ = this.productService.isLoading$;

    this.productService.configAll().subscribe((resp:any) =>
    {
      console.log(resp);
      this.almacenes = resp.almacenes || [];
      this.ESPECIFICACIONES = [];
      this.WAREHOUSES = resp.almacenes;
      this.SUCURSALES = resp.sucursales;
      this.UNITS = resp.units;
      this.CLIENT_SEGMENTS = resp.segments_clients;
      this.CATEGORIES = resp.categories;
      this.PROVIDERS = resp.providers;

      //this.loadProductData();
      if (this.PRODUCT_ID)
      {
        this.loadProductData();
      }
      else
      {
        console.error('No hay ID de producto disponible');
        this.toast.error('ERROR', 'No se pudo obtener el ID del producto');
      }
    })
  }

  loadProductData()
  {
    //console.log(this.PRODUCT_ID)
    this.productService.showProduct(this.PRODUCT_ID).subscribe((resp: any) =>
    {
      console.log('🔍 RESPUESTA COMPLETA DEL BACKEND:', JSON.stringify(resp, null, 2));
      console.log('📸 IMAGEN CRUDA (resp.data.imagen):', resp.data?.imagen);
      console.log('📸 PRODUCT_SELECTED.imagen:', resp.data?.imagen);

      this.PRODUCT_SELECTED = resp.data;

      if (!this.PRODUCT_SELECTED) {
        console.error('No se pudo cargar el producto');
        this.toast.error('ERROR', 'No se pudo cargar el producto');
        return;
      }

      // ⭐⭐⭐ LA PARTE MÁS IMPORTANTE - ASIGNACIÓN DE LA IMAGEN ⭐⭐⭐
      // Tomar la imagen exactamente como viene del backend
      const imagenDelBackend = this.PRODUCT_SELECTED.imagen;
      console.log('📸 Imagen del backend:', imagenDelBackend);

      if (imagenDelBackend && imagenDelBackend.trim() !== '') {
        this.imagen_previzualiza = imagenDelBackend;
      } else {
        this.imagen_previzualiza = 'assets/media/svg/files/blank-image.svg';
      }
      console.log('🖼️ imagen_previzualiza final:', this.imagen_previzualiza);

      // Datos básicos
      this.is_discount = this.PRODUCT_SELECTED.is_discount;
      this.title = this.PRODUCT_SELECTED.title;
      this.description = this.PRODUCT_SELECTED.description;
      //this.imagen_previzualiza = this.PRODUCT_SELECTED.imagen;
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
      //this.umbral_unit_id = this.PRODUCT_SELECTED.umbral_unit_id;
      this.umbral_unit_id = this.PRODUCT_SELECTED.umbral_unit_id || ''; // Si es null, usar string vacío
      this.weight = this.PRODUCT_SELECTED.weight;
      this.width = this.PRODUCT_SELECTED.width;
      this.height = this.PRODUCT_SELECTED.height;
      this.length = this.PRODUCT_SELECTED.length;
      //this.ESPECIFICACIONES = this.PRODUCT_SELECTED.specifications;
      if (this.PRODUCT_SELECTED.specifications === null)
      {
        this.ESPECIFICACIONES = [];
      }
      else
      {
        this.ESPECIFICACIONES = this.PRODUCT_SELECTED.specifications;
      }

      this.WAREHOUSES_PRODUCT = this.PRODUCT_SELECTED.warehouses;
      this.WALLETS_PRODUCT = this.PRODUCT_SELECTED.wallets;

      // Cargar warehouses del producto
      if (resp.data.warehouses && resp.data.warehouses.length > 0)
      {
        console.log('WAREHOUSES CRUDOS:', resp.data.warehouses);

        this.WAREHOUSES_PRODUCT = resp.data.warehouses.map((warehouse: any) => {
          // IMPORTANTE: El ID del registro en product_warehouses está en warehouse.pivot.id
          const warehouseProductId = warehouse.pivot?.id;
          
          console.log('ID del warehouse product (pivot.id):', warehouseProductId);
          console.log('pivot completo:', warehouse.pivot);
          
          return {
            id: warehouseProductId,  // ← ¡ESTE ES EL ID QUE NECESITAS!
            warehouse_id: warehouse.id,
            warehouse: {
              id: warehouse.id,
              name: warehouse.name,
              state: warehouse.state,
              address: warehouse.address,
              sucursale_id: warehouse.sucursale_id
            },
            unit_id: warehouse.pivot?.unit_id,
            unit: warehouse.unit,
            quantity: warehouse.pivot?.stock || 0,
            stock: warehouse.pivot?.stock || 0,
            pivot: warehouse.pivot
          };
        });

        console.log('WAREHOUSES PROCESADOS CON ID:', this.WAREHOUSES_PRODUCT);
        console.log('Warehouses cargados:', this.WAREHOUSES_PRODUCT);
        console.log('Por ahora hemos llegado a los almacenes');
      }

      // Cargar wallets del producto
      if (resp.data.wallets && resp.data.wallets.length > 0)
      {
        this.WALLETS_PRODUCT = resp.data.wallets.map((wallet: any) => ({
          id: wallet.id,
          unit_id: wallet.unit_id || wallet.unit?.id,  // ← Asegurar unit_id
          unit: wallet.unit,
          sucursale_id: wallet.sucursale_id || wallet.sucursale?.id,
          sucursale: wallet.sucursale || null,
          client_segment_id: wallet.client_segment_id || wallet.client_segment?.id,
          client_segment: wallet.client_segment || null,
          price_general: wallet.price_general || wallet.price || 0
        }));
        console.log('Wallets cargados:', this.WALLETS_PRODUCT);
      }
    });
  }

  addWarehouse()
  {
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

    let data = {
      product_id: this.PRODUCT_ID,
      unit_id: this.unit_warehouse,
      warehouse_id: this.almacen_warehouse,
      quantity: this.quantity_warehouse
    }

    const formData = new FormData();
    formData.append('product_id', data.product_id);
    formData.append('unit_id', data.unit_id);
    formData.append('warehouse_id', data.warehouse_id);
    formData.append('quantity', data.quantity.toString());

    this.ProductWarehousesService.registerProductWarehouse(formData).subscribe((resp:any) =>{
    this.WAREHOUSES_PRODUCT.push(resp.product_warehouse);
      this.almacen_warehouse = ''
      this.unit_warehouse = ''
      this.quantity_warehouse = 0

    this.toast.success("EXITO","Existencias agregadas correctamente al producto");
    this.isLoadingProcess();
    })

    console.log(this.WAREHOUSES_PRODUCT);
  }

  editWarehouse(warehouseProd: any, event?: Event)
  {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log("Editando warehouse product:", warehouseProd);
    console.log("ID del warehouse product:", warehouseProd.id);  // ← Debería tener un valor ahora
    
    const modalRef = this.modalService.open(EditWarehouseProductComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
    
    modalRef.componentInstance.WAREHOUSES_PROD = warehouseProd;
    modalRef.componentInstance.UNITS = this.UNITS;
    modalRef.componentInstance.WAREHOUSES = this.almacenes;
    modalRef.componentInstance.PRODUCT_ID = this.PRODUCT_SELECTED.id;
    modalRef.componentInstance.PRODUCT_WAREHOUSE_ID = warehouseProd.id;  // ← Ahora tiene el ID correcto
    
    modalRef.componentInstance.WarehouseE.subscribe((updatedWarehouse: any) => {
      const index = this.WAREHOUSES_PRODUCT.findIndex(w => w.id === updatedWarehouse.id);
      if (index !== -1) {
        this.WAREHOUSES_PRODUCT[index] = updatedWarehouse;
      }
    });
  }

  removeWarehouse(WAREHOUSES_PROD: any)
  {
    // Obtener el ID correcto
    const warehouseProductId = WAREHOUSES_PROD?.id || 
                              WAREHOUSES_PROD?.pivot?.id;
    
    console.log("ID a eliminar:", warehouseProductId);
    
    if (!warehouseProductId) {
      this.toast.error("ERROR", "No se pudo identificar el registro a eliminar");
      return;
    }

    const modalRef = this.modalService.open(DeleteWarehouseProductComponent, {
      centered: true,
      size: 'md'
    });

    modalRef.componentInstance.WAREHOUSES_PROD = {
      ...WAREHOUSES_PROD,
      id: warehouseProductId
    };
    modalRef.componentInstance.WAREHOUSES = this.almacenes;

    modalRef.componentInstance.WarehouseD.subscribe((wh_product: any) => {
      const INDEX = this.WAREHOUSES_PRODUCT.findIndex((wh_prod: any) => 
        wh_prod.id === warehouseProductId
      );
      if (INDEX !== -1) {
        this.WAREHOUSES_PRODUCT.splice(INDEX, 1);
        this.toast.success("ÉXITO", "Registro eliminado correctamente");
      }
      this.isLoadingProcess();
    });
  }

  addPriceMultiple()
  {
    if(!this.unit_price_multiple || ! this.quantity_price_multiple)
    {
      this.toast.error("VALIDACIÓN","Necesitas seleccionar una unidad, aparte de colocar un precio");
      return;
    }
    const UNIT_SELECTED = this.UNITS.find((unit:any) => unit.id == this.unit_price_multiple);
    const SUCURSALE_SELECTED = this.SUCURSALES.find((sucurs:any) => sucurs.id == this.sucursale_price_multiple);
    const CLIENT_SEGMENT_SELECTED = this.CLIENT_SEGMENTS.find((clisg:any) => clisg.id == this.client_segment_price_multiple);

    const INDEX_PRICE_MULTIPLE = this.WALLETS_PRODUCT.findIndex((wh_prod:any) =>
      (wh_prod.unit.id == this.unit_price_multiple) && (wh_prod.sucursale_price_multiple == this.sucursale_price_multiple)
      && (wh_prod.client_segment_price_multiple == this.client_segment_price_multiple));

    if(INDEX_PRICE_MULTIPLE != -1){
      this.toast.error("VALIDACIÓN","El precio de ese producto con la sucursal y unidad ya existe");
      return;
    }

    if (!this.PRODUCT_ID) {
        this.toast.error("ERROR", "No hay ID de producto válido");
        return;
      }

    let data = {
      product_id: this.PRODUCT_ID,
      unit_id: this.unit_price_multiple,
      client_segment_id: this.client_segment_price_multiple || null,
      sucursal_id: this.sucursale_price_multiple || null,
      price_general: this.quantity_price_multiple
    };

    const formData = new FormData();
    formData.append('product_id',data.product_id);
    formData.append('unit_id',data.unit_id);
    formData.append('client_segment_id',data.client_segment_id ? data.client_segment_id.toString() : '');
    formData.append('sucursal_id',data.sucursal_id ? data.sucursal_id.toString() : '');
    formData.append('price_general',data.price_general.toString());

    this.productWalletsService.registerProductWallet(formData).subscribe((resp:any) => {
      console.log(resp)
      this.WALLETS_PRODUCT.push(resp.product_wallet);
      this.isLoadingProcess();
      this.quantity_price_multiple = 0;
      this.sucursale_price_multiple = ''
      this.client_segment_price_multiple = '';
      this.unit_price_multiple = '';
      this.toast.success("EXITO", "El precio múltiple se ha agregado correctamente.");
    })

    /* console.log(this.WALLETS_PRODUCT);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(timeZone); */
  }

  removePriceMultiple(WALLETS_PROD:any)
  {
    // EL OBJETO QUE QUIERO ELIMINAR
    // LA LISTA DONDE SE ENCUENTRA EL OBJECTO QUE QUIERO ELIMINAR
    //  OBTENER LA POSICIÓN DEL ELEMENTO A ELIMINAR
    const modalRef = this.modalService.open(DeleteWalletPriceProductComponent,{centered:true,size:'md'});

    modalRef.componentInstance.WALLETS_PROD = WALLETS_PROD;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.WalletD.subscribe((wll_product:any) => {
      const INDEX = this.WALLETS_PRODUCT.findIndex((wll_prod:any) => wll_prod.id == WALLETS_PROD.id);
      if(INDEX!=-1)
      {
        //this.ROLES[INDEX] = rol;
        this.WALLETS_PRODUCT.splice(INDEX,1); //para eliminar un rol
      }
      this.isLoadingProcess();
    });
  }

  editProductWallet(WALLETS_PROD:any)
  {
    // Buscar el ID en la respuesta del update anterior si existe
    // O usar el ID de la URL/búsqueda

    console.log("WAREHOUSES_PROD en padre:", JSON.stringify(WALLETS_PROD, null, 2));

    const modalRef = this.modalService.open(EditWalletPriceProductComponent,{centered:true,size:'lg'});

    modalRef.componentInstance.WALLETS_PROD = WALLETS_PROD;
    modalRef.componentInstance.UNITS = this.UNITS;
    modalRef.componentInstance.SUCURSALES = this.SUCURSALES;
    modalRef.componentInstance.PRODUCT_ID = this.PRODUCT_ID; // ¡Esta línea es crítica!
    modalRef.componentInstance.CLIENT_SEGMENTS = this.CLIENT_SEGMENTS;

    // Recibimos los datos del componente hijo
    modalRef.componentInstance.WalletE.subscribe((wll_product: any) => {
        console.log("Producto recibido:", wll_product);

        /* const INDEX = this.WALLETS_PRODUCT.findIndex((wll_prod: any) =>
          (wll_prod.id && wll_prod.id == wll_product.id) ||
          (wll_prod.unit?.id ==  WALLETS_PROD.unit?.id &&
          wll_prod.warehouse?.id ==  WALLETS_PROD.warehouse?.id)
        ); */
        const INDEX = this.WALLETS_PRODUCT.findIndex((wll_prod: any) =>
          wll_prod.id == wll_product.id
        );

        if(INDEX != -1)
        {
          // También actualizar WAREHOUSES_PROD para futuras ediciones
          //this.WALLETS_PRODUCT[INDEX] = wll_product;
          //this.toast.success("ÉXITO", "Almacén actualizado correctamente");

          /* const updatedWallet = {
            ...wll_product,
            // Buscar el objeto unit completo
            unit: this.UNITS.find((u: any) => u.id == (wll_product.unit_id || wll_product.unit?.id)),
            // Buscar el objeto sucursale completo
            sucursale: wll_product.sucursale_id ?
              this.SUCURSALES.find((s: any) => s.id == wll_product.sucursale_id) :
              (wll_product.sucursale || null),
            // Buscar el objeto client_segment completo
            client_segment: wll_product.client_segment_id ?
              this.CLIENT_SEGMENTS.find((cs: any) => cs.id == wll_product.client_segment_id) :
              (wll_product.client_segment || null),
            // Mantener el precio
            price_general: wll_product.price_general || wll_product.price || wll_product.quantity
          };


          this.WALLETS_PRODUCT[INDEX] = updatedWallet;
          this.isLoadingProcess(); */
          // El objeto ya viene completo del hijo, solo asignamos
          this.WALLETS_PRODUCT[INDEX] = wll_product;

          // Forzar la detección de cambios
          this.WALLETS_PRODUCT = [...this.WALLETS_PRODUCT];

          console.log("Wallet actualizado en padre:", this.WALLETS_PRODUCT[INDEX]);
          this.isLoadingProcess();
        }
      });
  }

  addEspecif()
  {
    if (!this.key_v || !this.value_v)
    {
      this.toast.error("VALIDACIÓN", "Necesitas introducir una propiedad y su correspondiente valor");
      return;
    }

    if (!this.ESPECIFICACIONES || !Array.isArray(this.ESPECIFICACIONES))
    {
      this.ESPECIFICACIONES = [];
    }

    this.ESPECIFICACIONES.unshift({
      key_v: this.key_v,
      value_v: this.value_v
    });
    //console.log(this.ESPECIFICACIONES);
    this.key_v = '';
    this.value_v = '';
  }

  removeEspecif(i:number)
  {
    //this.ESPECIFICACIONES.splice(i,1);
    if (this.ESPECIFICACIONES && Array.isArray(this.ESPECIFICACIONES))
    {
      this.ESPECIFICACIONES.splice(i,1);
    }
  }

  isLoadingProcess()
  {
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  processFile($event:any)
  {
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

  isGift()
  {
    this.is_gift = this.is_gift == 1 ? 2 : 1;
    console.log(this.is_gift);
  }

  selectedDiscount(val:number)
  {
    this.is_discount = val;
  }

  selectedTab(val:number)
  {
    this.tab_selected = val;
  }

  store()
  {
    console.log('Editando producto ID:', this.PRODUCT_ID);

    if(!this.title ||
      !this.description ||
      !this.price_general ||
      !this.product_categorie_id ||
      !this.sku ||
      !this.tax_selected ||
      !this.importe_iva ||
      !this.weight  ||
      !this.width  ||
      !this.height  ||
      !this.length ||
      !this.provider_id
    )
    {
      this.toast.error("VALIDACIÓN","Necesitas llenar todos los campos obligatorios");
      return;
    }

    if(this.WAREHOUSES_PRODUCT.length == 0)
    {
      this.toast.error("VALIDACIÓN","Necesitas ingresar al menos un registro de existencia de producto");
      return;
    }

    if(this.WALLETS_PRODUCT.length == 0)
    {
      this.toast.error("VALIDACIÓN","Necesitas ingresar al menos un listado de precio al producto");
      return;
    }

    // Preparar datos de warehouses
    const warehousesData = this.WAREHOUSES_PRODUCT.map((warehouse: any) =>
    {
      const data: any = {
        warehouse_id: Number(warehouse.warehouse_id) || Number(warehouse.warehouse?.id),
        unit_id: Number(warehouse.unit_id) || Number(warehouse.pivot?.unit_id) || Number(warehouse.unit?.id),
        quantity: Number(warehouse.quantity) || Number(warehouse.pivot?.stock) || 0
      };
      
      if (warehouse.id)
      {
        data.id = Number(warehouse.id);
      }
      
      return data;
    });

    // Preparar datos de wallets
    const walletsData = this.WALLETS_PRODUCT.map((wallet: any) =>
    {
      const walletData: any = {};
      
      walletData.unit_id = Number(wallet.unit_id) || Number(wallet.unit?.id);
      walletData.price = Number(wallet.price_general) || Number(wallet.price) || 0;
      walletData.product_id = Number(this.PRODUCT_ID);
      
      if (wallet.client_segment_id || wallet.client_segment?.id)
      {
        walletData.client_segment_id = Number(wallet.client_segment_id) || Number(wallet.client_segment?.id);
      }
      
      if (wallet.sucursale_id || wallet.sucursale?.id)
      {
        walletData.sucursale_id = Number(wallet.sucursale_id) || Number(wallet.sucursale?.id);
      }
      
      if (wallet.id)
      {
        walletData.id = Number(wallet.id);
      }
      
      console.log('Wallet a enviar:', walletData);
      return walletData;
    })  ;

    console.log('=== DATOS PARA ACTUALIZAR ===');
    console.log('WarehousesData:', warehousesData);
    console.log('WalletsData:', walletsData);

    const specificationsData = (this.ESPECIFICACIONES && Array.isArray(this.ESPECIFICACIONES)) ? this.ESPECIFICACIONES.map((esp: any) => ({
          key_v: esp.key_v,
          value_v: esp.value_v
        })) : [];

    console.log('ESPECIFICACIONES original:', this.ESPECIFICACIONES);
    console.log('ESPECIFICACIONES formateadas:', specificationsData);
    console.log('ESPECIFICACIONES JSON:', JSON.stringify(specificationsData));

    const formData = new FormData();
    formData.append("title", this.title);
    formData.append("description", this.description);
    formData.append("specifications", JSON.stringify(specificationsData));
    formData.append("state", this.state);
    formData.append("product_categorie_id", this.product_categorie_id);

    // Solo agregar imagen si se seleccionó una nueva (archivo)
    if (this.imagen_product && typeof this.imagen_product !== 'string')
    {
      formData.append("product_imagen", this.imagen_product);
    }
    else if (this.imagen_previzualiza && this.imagen_previzualiza.startsWith('http'))
    {
      formData.append("imagen_url", this.imagen_previzualiza);
      console.log('Enviando URL externa:', this.imagen_previzualiza);
    }
    if (this.image_removed)
    {
      formData.append("image_removed", "true");
    }

    formData.append("provider_id", this.provider_id.toString());
    formData.append("price_general", this.price_general.toString());
    formData.append("disponibilidad", this.disponibilidad.toString());
    formData.append("tiempo_de_abastecimiento", this.tiempo_de_abastecimiento.toString());
    formData.append("is_discount", this.is_discount.toString());
    formData.append("min_discount", this.min_discount.toString());
    formData.append("max_discount", this.max_discount.toString());
    formData.append("tax_selected", this.tax_selected.toString());
    formData.append("importe_iva", this.importe_iva.toString());
    formData.append("sku", this.sku);
    formData.append("is_gift", this.is_gift.toString());
    formData.append("weight", this.weight.toString());
    formData.append("width", this.width.toString());
    formData.append("height", this.height.toString());
    formData.append("length", this.length.toString());
    formData.append("umbral", this.umbral.toString());
    
    // ⭐⭐⭐ SOLUCIÓN PRINCIPAL: Manejar umbral_unit_id correctamente ⭐⭐⭐
    // Enviar como string vacío o 0 en lugar de null
    const umbralUnitIdValue = this.umbral_unit_id && this.umbral_unit_id !== 'null' && this.umbral_unit_id !== '' ? this.umbral_unit_id.toString() : '';

    formData.append("umbral_unit_id", umbralUnitIdValue);
    
    formData.append('_method', 'PUT');

    // Agregar warehouses y wallets
    console.log('WarehousesData a enviar:', JSON.stringify(warehousesData, null, 2));
    console.log('WalletsData a enviar:', JSON.stringify(walletsData, null, 2));

    formData.append("warehouses", JSON.stringify(warehousesData));
    // formData.append("wallets", JSON.stringify(walletsData)); // Descomentar si es necesario

    this.productService.updateProduct(this.PRODUCT_ID, formData).subscribe({
        next: (response) =>
        {
          console.log('✅ Producto actualizado:', response);
          this.toast.success('Producto actualizado correctamente');
        },
        error: (error) =>
        {
          console.error('❌ Error al actualizar:', error);
          console.error('Detalles del error:', error.error);
          
          if (error.error && error.error.errors)
          {
            const errors = error.error.errors;
            Object.keys(errors).forEach(key =>
            {
              this.toast.error(`${key}: ${errors[key].join(', ')}`);
            });
          }
          else if (error.error && error.error.message)
          {
            this.toast.error(error.error.message);
          }
          else
          {
            this.toast.error('Error al actualizar el producto');
          }
        }
    });
  }

  cleanForm()
  {
      this.title = '';
      this.description = ''
      this.state = '1';
      this.product_categorie_id = '';
      this.provider_id =0;
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

  // Agrega este método para manejar errores de carga de imágenes
  onImageError()
  {
    console.log('Error al cargar la imagen, usando placeholder', this.imagen_previzualiza);
    //this.imagen_previzualiza = 'assets/media/svg/files/blank-image.svg';
    //this.imagen_product = null;
  }

  // Agrega este método para eliminar la imagen
  removeImage()
  {
    this.imagen_previzualiza = 'assets/media/svg/files/blank-image.svg';
    this.imagen_product = null;
    
    // Agregar un campo para indicar que se eliminó la imagen
    this.image_removed = true; // Agrega esta variable al componente
    
    this.toast.info("IMAGEN", "Imagen eliminada. Se usará el placeholder.");
  }

  getImageUrl(): string
  {
    if (this.imagen_previzualiza && this.imagen_previzualiza !== 'assets/media/svg/files/blank-image.svg') {
      return this.imagen_previzualiza;
    }
    return 'assets/media/svg/files/blank-image.svg';
  }

  getImageName(): string
  {
    if (this.imagen_previzualiza && this.imagen_previzualiza !== 'assets/media/svg/files/blank-image.svg') {
      // Si es una URL, mostrar solo el nombre del archivo o un mensaje
      if (this.imagen_previzualiza.startsWith('http')) {
        return 'Imagen externa';
      }
      return this.imagen_previzualiza.split('/').pop() || 'Imagen actual';
    }
    return 'No hay imagen seleccionada';
  }

  getUnitDisplayName(warehouseProd: any): string
  {
    // Si unit es un array y tiene elementos
    if (warehouseProd.unit && Array.isArray(warehouseProd.unit) && warehouseProd.unit.length > 0) {
      return warehouseProd.unit[0]?.name || 'N/A';
    }
    
    // Si hay pivot con unit_id
    if (warehouseProd.pivot?.unit_id && this.UNITS) {
      const unit = this.UNITS.find(u => u.id == warehouseProd.pivot.unit_id);
      return unit?.name || 'N/A';
    }
    
    return 'N/A';
  }

  // Método para obtener el nombre de la unidad
  getUnitName(warehouseProd: any): string
  {
    if (warehouseProd.unit && Array.isArray(warehouseProd.unit) && warehouseProd.unit.length > 0)
    {
      return warehouseProd.unit[0]?.name || 'N/A';
    }
    if (warehouseProd.unit && warehouseProd.unit.name)
    {
      return warehouseProd.unit.name;
    }
    if (warehouseProd.pivot?.unit_id && this.UNITS)
    {
      const unit = this.UNITS.find(u => u.id == warehouseProd.pivot.unit_id);
      return unit?.name || 'N/A';
    }
    return 'N/A';
  }

  // Método para obtener el nombre del almacén
  getWarehouseName(warehouseProd: any): string
  {
    if (warehouseProd.warehouse?.name)
    {
      return warehouseProd.warehouse.name;
    }
    if (warehouseProd.pivot?.warehouse_id && this.almacenes)
    {
      const warehouse = this.almacenes.find(w => w.id == warehouseProd.pivot.warehouse_id);
      return warehouse?.name || 'N/A';
    }
    return 'N/A';
  }

  // Método para obtener la cantidad
  getWarehouseQuantity(warehouseProd: any): number
  {
    return warehouseProd.quantity || warehouseProd.pivot?.stock || 0;
  }
}
