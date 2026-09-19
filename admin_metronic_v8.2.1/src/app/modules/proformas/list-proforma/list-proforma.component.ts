import { Component, inject } from '@angular/core';
import { DeleteProformaComponent } from '../delete-proforma/delete-proforma.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProformasService } from '../service/proformas.service';
import { URL_SERVICIOS } from '../../../config/config';


@Component({
  selector: 'app-list-proforma',
  /* standalone: true,
  imports: [], */
  templateUrl: './list-proforma.component.html',
  styleUrls: ['./list-proforma.component.scss']
})
export class ListProformasComponent
{
  search = '';
  PROFORMAS:any =[];
  isLoading$:any;

  totalPages = 0;
  currentPage = 1;

  client_segments: any = [];
  client_segment_id = '';
  type = '';

  asesor_id='';

  search_client = '';
  start_date: any = null;
  end_date: any = null;
  product_categorie_id = '';
  product_categories: any = [];
  search_product = '';

  asesores:any = [];

  // Prefer inject() over constructor injection
  public modalService = inject(NgbModal);
  public proformaService = inject(ProformasService);

  constructor() {}

  ngOnInit(): void
  {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.proformaService.isLoading$;
    this.listProformas();
    this.configAll();
  }
  //PARA OBTENER LA CONFIGURACIÓN DE CLIENTES
  configAll()
  {
    this.proformaService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
      this.product_categories = resp.product_categories;
    });
  }
  //PARA EL LISTADO DE PROFORMAS
  listProformas(page = 1)
  {
    let data = {
      search: this.search,
      client_segment_id: this.client_segment_id,
      //type: this.type,
      asesor_id: this.asesor_id,
      product_categorie_id: this.product_categorie_id,
      search_client: this.search_client,
      search_product: this.search_product,
      start_date: this.start_date,
      end_date: this.end_date,
      state_proforma: this.type,
    };

    this.proformaService.listProformas(page,data).subscribe((resp:any) => {
      console.log(resp);
      //this.PROFORMAS = resp.PROFORMAS;
      this.PROFORMAS = resp.proformas.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }
  resetlistProformas()
  {
    this.search = '';
    this.product_categorie_id = '';
    this.client_segment_id = '';
    this.search_client = '';
    this.search_product = '';
    this.start_date = null;
    this.end_date = null;
    this.type = '';
    this.asesor_id = '';
    this.listProformas();
  }
  //ELIMINACIÓN DE CLIENTES
  deleteProforma(PROFORMA_SELECTED:any)
  {
    const modalRef = this.modalService.open(DeleteProformaComponent,{centered:true,size:'md'});

    modalRef.componentInstance.proforma_selected = PROFORMA_SELECTED;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ProformasD.subscribe((client_s:any) => {
      const INDEX = this.PROFORMAS.findIndex((client_s:any) => client_s.id == PROFORMA_SELECTED.id);
      if(INDEX!=-1)
      {
        //this.ROLES[INDEX] = rol;
        this.PROFORMAS.splice(INDEX,1); //para eliminar un rol
      }
    });
  }
  //EXPORTACIÓN DE CLIENTES
  exportProformas()
  {
    let LINK ="";
    /*
    if(this.search)
    {
      LINK += "&search="+this.search;
    }
    if(this.client_segment_id)
    {
      LINK += "&client_segment_id="+this.client_segment_id;
    }
    if(this.type)
    {
      LINK += "&type="+this.type;
    }
    if(this.asesor_id)
    {
      LINK += "&asesor_id="+this.asesor_id;
    }
    // Lógica para exportar clientes
    window.open(URL_SERVICIOS+"/excel/export-clients?k=1"+LINK,"_blank"); */
  }

  //Función para las acciones tras el cambio de pagina en la paginación
  loadPage($event:any)
  {
    this.listProformas($event);
  }
}
