import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateClientsCompanyComponent } from '../create-clients-company/create-clients-company.component';
import { CreateClientsPersonComponent } from '../create-clients-person/create-clients-person.component';
import { EditClientsCompanyComponent } from '../edit-clients-company/edit-clients-company.component';
import { EditClientsPersonComponent } from '../edit-clients-person/edit-clients-person.component';
import { DeleteClientsComponent } from '../delete-clients/delete-clients.component';
import { ClientsService } from '../service/clients.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-list-clients',
  //standalone: true,
  //imports: [],
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent {
  search = '';
  CLIENTS:any =[];
  isLoading$:any;

  totalPages = 0;
  currentPage = 1;

  client_segments: any = [];
  client_segment_id = '';
  type = '';

  asesor_id='';

  asesores:any = [];

  // Prefer inject() over constructor injection
  public modalService = inject(NgbModal);
  public clientsService = inject(ClientsService);

  constructor() {}

  ngOnInit(): void
  {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.clientsService.isLoading$;
    this.listClients();
    this.listConfig();
  }
  //PARA OBTENER LA CONFIGURACIÓN DE CLIENTES
  listConfig()
  {
    this.clientsService.listConfig().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
    });
  }
  //PARA CREAR CLIENTES
  createClientCompany()
  {
    const modalRef = this.modalService.open(CreateClientsCompanyComponent,{centered:true,size: 'xl'});
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientsC.subscribe((client:any) => {
      console.log(client);
      //this.CLIENTS.push(client_segment);//Se agrega al final del listado
      this.CLIENTS.unshift(client);//Se agrega al principio del listado
      this.listClients(this.currentPage);
    });
  }
  createClientPerson()
  {
    const modalRef = this.modalService.open(CreateClientsPersonComponent,{centered:true,size: 'xl'});
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientsC.subscribe((client:any) => {
      console.log(client);
      if (this.CLIENTS)
      {
        //this.CLIENTS.unshift(this.client_segments);//Se agrega al principio del listado
        this.CLIENTS.unshift(client);
        this.listClients(this.currentPage);
      }
      else
      {
        //this.CLIENTS = [this.client_segments];
        this.CLIENTS = [client];
        this.listClients(this.currentPage);
      }
    });
  }
  //PARA EL ISTADO DE CLIENTES
  listClients(page = 1)
  {
    let data = {
      search: this.search,
      client_segment_id: this.client_segment_id,
      type: this.type,
      asesor_id: this.asesor_id
    };

    this.clientsService.listClients(page,data).subscribe((resp:any) => {
      console.log(resp);
      //this.CLIENTS = resp.CLIENTS;
      this.CLIENTS = resp.clients.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }
  resetListClients()
  {
    this.search = '';
    this.client_segment_id = '';
    this.type = '';
    this.asesor_id = '';
    this.listClients();
  }
  //EDICIÓN DE CLIENTES
  editClientCompany(CLIENT_SELECTED:any)
  {
    const modalRef = this.modalService.open(EditClientsCompanyComponent,{centered:true,size:'xl'});
    modalRef.componentInstance.client_selected = CLIENT_SELECTED;
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientsE.subscribe((client:any) => {
      const INDEX = this.CLIENTS.findIndex((client_s:any) => client_s.id == CLIENT_SELECTED.id);
      //console.log(INDEX);
      if(INDEX!=-1)
      {
        this.CLIENTS[INDEX] = client;
      }
    });
  }
  editClientPerson(CLIENT_SELECTED:any)
  {
    const modalRef = this.modalService.open(EditClientsPersonComponent,{centered:true,size:'xl'});
    modalRef.componentInstance.client_selected = CLIENT_SELECTED;
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientsE.subscribe((clientE:any) => {
      const INDEX = this.CLIENTS.findIndex((client:any) => client.id == CLIENT_SELECTED.id);
      //console.log(INDEX);
      if(INDEX!=-1)
      {
        this.CLIENTS[INDEX] = clientE;
      }
    });
  }
  //ELIMINACIÓN DE CLIENTES
  deleteClient(CLIENT_SELECTED:any)
  {
    const modalRef = this.modalService.open(DeleteClientsComponent,{centered:true,size:'md'});

    modalRef.componentInstance.client_selected = CLIENT_SELECTED;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientsD.subscribe((client_s:any) => {
      const INDEX = this.CLIENTS.findIndex((client_s:any) => client_s.id == CLIENT_SELECTED.id);
      if(INDEX!=-1)
      {
        //this.ROLES[INDEX] = rol;
        this.CLIENTS.splice(INDEX,1); //para eliminar un rol
      }
    });
  }
  //EXPORTACIÓN DE CLIENTES
  exportClients()
  {
    // Lógica para exportar clientes
  }
  //IMPORTACIÓN DE CLIENTES
  importClients()
  {
    // Lógica para importar clientes
  }
  //Función para las acciones tras el cambio de pagina en la paginación
  loadPage($event:any)
  {
    this.listClients($event);
  }
}
