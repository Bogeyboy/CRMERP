import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ListProductComponent } from './list-product/list-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
  {
    path:'',
    component: ProductsComponent,
    children:[
      {
        path:'list',
        component: ListProductComponent
      },
      {
        path:'register',
        component: CreateProductComponent
      },
      {
        path:'edit/:id',
        component: EditProductComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
