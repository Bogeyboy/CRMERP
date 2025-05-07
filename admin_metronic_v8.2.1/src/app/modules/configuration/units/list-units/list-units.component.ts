import { Component, Provider } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsService } from '../service/units.service';
import { CreateUnitsComponent } from '../create-units/create-units.component';
import { EditUnitsComponent } from '../edit-units/edit-units.component';
import { DeleteUnitsComponent } from '../delete-units/delete-units.component';
import { CreateTransformUnitsComponent } from '../create-transform-units/create-transform-units.component';

@Component({
  selector: 'app-list-units',
  //imports: [],
  templateUrl: './list-units.component.html',
  styleUrls: ['./list-units.component.scss']
})
export class ListUnitsComponent {
  search:string = '';
  UNITS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public unitService: UnitsService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.unitService.isLoading$;
    this.listUnits();
  }

  listUnits(page = 1){
    this.unitService.listUnits(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.UNITS = resp.units;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listUnits($event);
  }

  createUnit(){
    const modalRef = this.modalService.open(CreateUnitsComponent,{centered:true, size: 'md'});

    modalRef.componentInstance.UnitC.subscribe((unit:any) => {
      this.UNITS.unshift(unit);
    })
  }

  editUnit(UNIT:any){
    const modalRef = this.modalService.open(EditUnitsComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.UNIT_SELECTED = UNIT;

    modalRef.componentInstance.UnitE.subscribe((unit:any) => {
      let INDEX = this.UNITS.findIndex((un:any) => un.id == UNIT.id);
      if(INDEX != -1){
        this.UNITS[INDEX] = unit;
      }
    })
  }

  deleteUnit(UNIT:any){
    const modalRef = this.modalService.open(DeleteUnitsComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.UNIT_SELECTED = UNIT;

    modalRef.componentInstance.UnitD.subscribe((unit:any) => {
      let INDEX = this.UNITS.findIndex((un:any) => un.id == UNIT.id);
      if(INDEX != -1){
        this.UNITS.splice(INDEX,1);
      }
    })
  }

  addTransform(UNIT:any){
    const modalRef = this.modalService.open(CreateTransformUnitsComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.UNIT_SELECTED = UNIT;
    //modalRef.componentInstance.UNITS = this.UNITS;//Así salen tooooodos los elementos del listado
    modalRef.componentInstance.UNITS = this.UNITS.filter((unit:any) => unit.id != UNIT.id);//Así solo salen los elementos que no son el seleccionado
  }
}
