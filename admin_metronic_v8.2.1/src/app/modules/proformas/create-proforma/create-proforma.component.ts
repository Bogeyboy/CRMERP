import { ProformasService } from './../service/proformas.service';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateClientsPersonComponent } from '../../clients/create-clients-person/create-clients-person.component';
import { CreateClientsCompanyComponent } from '../../clients/create-clients-company/create-clients-company.component';
import { ThisReceiver } from '@angular/compiler';
import { SearchClientsComponent } from '../components/search-clients/search-clients.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  ],
  templateUrl: './create-proforma.component.html',
  styleUrls: ['./create-proforma.component.scss']
})
export class CreateProformaComponent {

  //VARIABLES DE LOS CLIENTES
  CLIENT_SELECTED:any;

  n_document = '';
  full_name = '';
  phone = '';
  birthdate: string | null  = null;
  displayBirthdate = '';
  //VARIABLES DE LOS PRODUCTOS
  price = 0;
  quantity_product = 0;
  unit = '';
  warehouse = '';
  description_product = '';

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

  isLoading$: any;

  // Use inject() instead of constructor injection to satisfy lint rule
  /* public modalService = inject(NgbModal);
  public proformaService = inject(ProformasService); */

  constructor(
    private modalService: NgbModal,
    private proformaService: ProformasService,
    public toast : ToastrService,
    private cdr: ChangeDetectorRef
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
    this.proformaService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
    });
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

  searchClients()
  {
    if(!this.n_document && !this.full_name && !this.phone)
    {
      this.toast.error('Error', 'Se necesita alguno de los campos de búsqueda.');
      return;
    }
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

  openSelectedClients(clients:any = [])
  {
    const modalRef = this.modalService.open(SearchClientsComponent, { size: 'lg', centered: true });
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

  resetClient()
  {
    this.CLIENT_SELECTED = null;
    this.n_document = '';
    this.full_name = '';
    this.phone = '';
    this.isLoadingProcess();
  }
}
