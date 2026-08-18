/* import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UBIGEO_DISTRITOS } from '../../../config/ubigeo_distritos';
import { UBIGEO_PROVINCIAS } from '../../../config/ubigeo_provincias';
import { UBIGEO_REGIONES } from '../../../config/ubigeo_regiones';
import { AuthService } from '../../auth';
import { ClientsService } from '../service/clients.service'; */
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ClientsService } from '../service/clients.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { UBIGEO_REGIONES } from '../../../config/ubigeo_regiones';
import { UBIGEO_PROVINCIAS } from '../../../config/ubigeo_provincias';
import { UBIGEO_DISTRITOS } from '../../../config/ubigeo_distritos';


@Component({
  selector: 'app-create-clients-company',
  standalone: true,
  
  templateUrl: './create-clients-company.component.html',
  styleUrl: './create-clients-company.component.scss',
  imports: [FormsModule, CommonModule]
})
export class CreateClientsCompanyComponent {
@Output() ClientsC = new EventEmitter<any>();

  @Input() client_segments: any = [];
  @Input() asesores: any = [];

  tab_selected = 1;

  //Variables datos generales
  full_name ='';
  sexo = '';
  phone = 0;
  email = '';
  birthdate:any = null;
  displayBirthdate= '';
  type_document = 'NIF';
  client_segment_id = '';

  //client_segment = '';
  n_document = '';
  address = '';
  origen = '';
  is_parcial = 1;


  //Variables datos específicos
  distrito = '';
  region = '';
  provincia = '';
  ubigeo_region = '';
  ubigeo_provincia = '';
  ubigeo_distrito = '';

  asesor_id = '';

  REGIONES:any = UBIGEO_REGIONES;
  PROVINCIAS: any = UBIGEO_PROVINCIAS;
  PROVINCIA_SELECTEDS: any = [];
  DISTRITOS: any = UBIGEO_DISTRITOS;
  DISTRITOS_SELECTEDS: any = [];

  //Otras variables
  isLoading:any;

  // Prefer inject() for standalone injection of framework-provided tokens
  public modal = inject(NgbActiveModal);
  private http = inject(HttpClient);
  public authservice = inject(AuthService);
  public clientsService = inject(ClientsService);
  public toast = inject(ToastrService);

  convertToBackendFormat(dateStr: string): string | null
  {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }
  // Función para convertir de backend a input
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
    } else {
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

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  changeDocumentMask($event)
  {
    let TIPODOCUMENTO = $event.target.value;
    console.log(TIPODOCUMENTO);
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
  selectedTab(val: number)
  {
    this.tab_selected = val;
  }
  selectedParcial()
  {
    this.is_parcial = this.is_parcial == 1 ? 2 : 1;
  }
  //Función para guardar los clientes persona
  store()
  {
    if(!this.full_name ||
      !this.client_segment_id ||
      !this.type_document ||
      !this.n_document ||
      !this.origen ||
      !this.birthdate ||
      !this.phone ||
      !this.ubigeo_distrito ||
      !this.ubigeo_provincia ||
      !this.ubigeo_region ||
      !this.address)
    {
      this.toast.error("Validación","Es necesario rellenar todos los campos obligatorios.");
      return false;
    }

    //VALIDACIÓN PARA FECHA DE ANIVERSARIO
    let birthdateToSend = this.birthdate;
    console.log("birthdateToSend: ", birthdateToSend);
    if (birthdateToSend && typeof birthdateToSend === 'string')
    {
      // Si está en formato YYYY-MM-DD, convertirlo a DD-MM-YYYY
      console.log(" Dentro del primer if birthdateToSend: ", birthdateToSend);
      if (birthdateToSend.match(/^\d{4}-\d{2}-\d{2}$/))
      {
        console.log(" Dentro del segundo if birthdateToSend: ", birthdateToSend);
        const [year, month, day] = birthdateToSend.split('-');
        birthdateToSend = `${day}-${month}-${year}`;
      }
    }

    //let DISTRITO_SELECTED = this.DISTRITOS.find((distr:any)=>distr.id = this.ubigeo_distrito)
    let DISTRITO_SELECTED = this.DISTRITOS.find((distr:any)=>distr.id === this.ubigeo_distrito)
    if(DISTRITO_SELECTED)
    {
      this.distrito = DISTRITO_SELECTED.name;
    };

    let data = {
      full_name : this.full_name,
      phone: this.phone,
      email: this.email,
      //birthdate: this.birthdate,
      birthdate: birthdateToSend,
      type_document: this.type_document,
      client_segment_id: this.client_segment_id,
      n_document: this.n_document,
      address: this.address,
      origen: this.origen,
      is_parcial: this.is_parcial,
      ubigeo_region: this.ubigeo_region,
      ubigeo_provincia: this.ubigeo_provincia,
      ubigeo_distrito: this.ubigeo_distrito,
      region: this.region,
      distrito: this.distrito,
      provincia: this.provincia,
      asesor_id: this.asesor_id,
      type: 2
      //address: this.address
    }

    this.clientsService.registerClient(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Error de validación",resp.message_text);
      }
      else
      {
        console.log("Empresa añadida correctamente: ", resp.client);
        this.toast.success("Éxito","Empresa añadida correctamente.");
        this.ClientsC.emit(resp.client);
        this.modal.close();
      }
    });
  }
}
