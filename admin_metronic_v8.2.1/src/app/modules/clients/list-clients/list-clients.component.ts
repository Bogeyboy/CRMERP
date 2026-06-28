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
  CLIENTS:any[];
  isLoading$:any;

  totalPages = 0;
  currentPage = 1;

  client_segments: any = [];
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
    const modalRef = this.modalService.open(CreateClientsCompanyComponent,{centered:true,size: 'fullscreen'});
    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientsC.subscribe((client_segment:any) => {
      console.log(client_segment);
      //this.CLIENTS.push(client_segment);//Se agrega al final del listado
      this.CLIENTS.unshift(client_segment);//Se agrega al principio del listado
    });
  }
  createClientPerson()
  {
    const modalRef = this.modalService.open(CreateClientsPersonComponent,{centered:true,size: 'xl'});
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientsC.subscribe((client_segment:any) => {
      console.log(client_segment);
      //this.CLIENTS.push(client_segment);//Se agrega al final del listado
      this.CLIENTS.unshift(client_segment);//Se agrega al principio del listado
    });
  }
  //PARA EL ISTADO DE CLIENTES
  listClients(page = 1)
  {
    this.clientsService.listClients(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.CLIENTS = resp.CLIENTS;
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }
  //EDICIÓN DE CLIENTES
  editClientCompany(CLIENT_SEGMENT:any)
  {
    const modalRef = this.modalService.open(EditClientsCompanyComponent,{centered:true,size:'md'});
    modalRef.componentInstance.CLIENT_SEGMENT_SELECTED = CLIENT_SEGMENT;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientSegmentE.subscribe((client_segment:any) => {
      const INDEX = this.CLIENTS.findIndex((client_seg:any) => client_seg.id == CLIENT_SEGMENT.id);
      //console.log(INDEX);
      if(INDEX!=-1)
      {
        this.CLIENTS[INDEX] = client_segment;
      }
    });
  }
  editClientPerson(CLIENT_SEGMENT:any)
  {
    const modalRef = this.modalService.open(EditClientsPersonComponent,{centered:true,size:'md'});
    modalRef.componentInstance.CLIENT_SEGMENT_SELECTED = CLIENT_SEGMENT;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientSegmentE.subscribe((client_segment:any) => {
      const INDEX = this.CLIENTS.findIndex((client_seg:any) => client_seg.id == CLIENT_SEGMENT.id);
      //console.log(INDEX);
      if(INDEX!=-1)
      {
        this.CLIENTS[INDEX] = client_segment;
      }
    });
  }
  //ELIMINACIÓN DE CLIENTES
  deleteClient(CLIENT_SEGMENT:any)
  {
    const modalRef = this.modalService.open(DeleteClientsComponent,{centered:true,size:'md'});

    modalRef.componentInstance.CLIENT_SEGMENT_SELECTED = CLIENT_SEGMENT;

    //Recibimos los datos del componente hijo
    modalRef.componentInstance.ClientSegmentD.subscribe((client_segment:any) => {
      const INDEX = this.CLIENTS.findIndex((client_seg:any) => client_seg.id == CLIENT_SEGMENT.id);
      if(INDEX!=-1)
      {
        //this.ROLES[INDEX] = rol;
        this.CLIENTS.splice(INDEX,1); //para eliminar un rol
      }
    });
  }
  //Función para las acciones tras el cambio de pagina en la paginación
  loadPage($event:any)
  {
    this.listClients($event);
  }
}
