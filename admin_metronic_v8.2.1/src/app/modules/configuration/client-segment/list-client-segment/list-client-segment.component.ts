import { Component } from '@angular/core';
import { ClientSegmentService } from '../service/client-segment.service';
import { CreateClientSegmentComponent } from '../create-client-segment/create-client-segment.component';
import { EditClientSegmentComponent } from '../edit-client-segment/edit-client-segment.component';
import { DeleteClientSegmentComponent } from '../delete-client-segment/delete-client-segment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-client-segment',
  //imports: [],
  templateUrl: './list-client-segment.component.html',
  styleUrls: ['./list-client-segment.component.scss']
})
export class ListClientSegmentComponent {
    
    search:string = '';
    CLIENT_SEGMENTS:any[];
    isLoading$:any;
  
    totalPages:number = 0;
    currentPage:number = 1;
  
    constructor(
      public modalService: NgbModal,
      public clientSegmentService: ClientSegmentService,)
    {
  
    }
    
    ngOnInit(): void 
    {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.isLoading$ = this.clientSegmentService.isLoading$;
      this.listClientSegments();
    }
  
    //PARA CREAR UNA SUCURSAL
    createClientSegment()
    {
      const modalRef = this.modalService.open(CreateClientSegmentComponent,{centered:true,size:'md'});
      //Recibimos los datos del componente hijo
      modalRef.componentInstance.ClientSegmentC.subscribe((client_segment:any) => {
        console.log(client_segment);
        //this.CLIENT_SEGMENTS.push(client_segment);//Se agrega al final del listado
        this.CLIENT_SEGMENTS.unshift(client_segment);//Se agrega al principio del listado
      });
    }
  
    //PARA LISTAR LAS CLIENT_SEGMENTS
    listClientSegments(page = 1)
    {
      this.clientSegmentService.listClientSegments(page,this.search).subscribe((resp:any) => {
        console.log(resp);
        this.CLIENT_SEGMENTS = resp.client_segments;
        this.totalPages = resp.total;
        this.currentPage = page;
      });
    }
    //Edición de sucursal
    editClientSegment(CLIENT_SEGMENT:any)
    {
      const modalRef = this.modalService.open(EditClientSegmentComponent,{centered:true,size:'md'});
  
      modalRef.componentInstance.CLIENT_SEGMENT_SELECTED = CLIENT_SEGMENT;
  
      //Recibimos los datos del componente hijo
      modalRef.componentInstance.ClientSegmentE.subscribe((client_segment:any) => {
        let INDEX = this.CLIENT_SEGMENTS.findIndex((client_seg:any) => client_seg.id == CLIENT_SEGMENT.id);
        //console.log(INDEX);
        if(INDEX!=-1)
        {
          this.CLIENT_SEGMENTS[INDEX] = client_segment;
        }
      });
    }
    //Eliminación de sucursal
    deleteClientSegment(CLIENT_SEGMENT:any)
    {
      const modalRef = this.modalService.open(DeleteClientSegmentComponent,{centered:true,size:'md'});

      modalRef.componentInstance.CLIENT_SEGMENT_SELECTED = CLIENT_SEGMENT;

      //Recibimos los datos del componente hijo
      modalRef.componentInstance.ClientSegmentD.subscribe((client_segment:any) => {
        let INDEX = this.CLIENT_SEGMENTS.findIndex((client_seg:any) => client_seg.id == CLIENT_SEGMENT.id);
        if(INDEX!=-1)
        {
          //this.ROLES[INDEX] = rol;
          this.CLIENT_SEGMENTS.splice(INDEX,1); //para eliminar un rol
        }
      });
    }
  
    //Función para las acciones tras el cambio de pagina en la paginación
    loadPage($event:any)
    {
      this.listClientSegments($event);
    }
}
