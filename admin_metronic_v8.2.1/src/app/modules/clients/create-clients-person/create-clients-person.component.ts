import { Component, EventEmitter, Output, inject } from '@angular/core';
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
  selector: 'app-create-clients-person',
  standalone: true,
  //imports: [],
  templateUrl: './create-clients-person.component.html',
  styleUrl: './create-clients-person.component.scss',
  imports: [FormsModule, CommonModule]
})
export class CreateClientsPersonComponent
{
  @Output() ClientsC = new EventEmitter<any>();

  tab_selected = 1;

  //Variables datos generales
  name ='';
  surname = '';
  sexo = '';
  phone = 0;
  email = '';
  birthdate:any = null;
  type_document = '';
  client_segment_id = '';
  n_document = '';
  address = '';
  origen = '';
  is_parcial = 1;

  //Variables datos específicos
  ubigeo_region = '';
  ubigeo_provincia = '';
  ubigeo_distrito = '';

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

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  changeRegion($event: any)
  {
    console.log($event.target.value);
    let REGION_ID = $event.target.value;
    let provincias = this.PROVINCIAS.filter((provincia:any) => provincia.department_id == REGION_ID);
    this.PROVINCIA_SELECTEDS = provincias;
    console.log(provincias);
  }
  changeProvincia($event: any)
  {
    console.log($event.target.value);
    let PROVINCIA_ID = $event.target.value;
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
  //Función para guardar los permisos
  store()
  {
    if(!this.name)
    {
      this.toast.error("Validación","El nombre de cliente es requerido.");
      return false;
    }

    const data = {
      name: this.name,
      //address: this.address
    }

    this.clientsService.registerClient(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403)
      {
        this.toast.error("Validación",resp.message_text);
      }
      else
      {
        this.toast.success("Éxito","Cliente añadido correctamente.");
        this.ClientsC.emit(resp.client);
        this.modal.close();
      }
    });
  }
}
