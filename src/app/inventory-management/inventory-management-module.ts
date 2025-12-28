import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product';
import { ProductListComponent } from './product-list/product-list';

const routes = [
  {
    path: '',
    component: AddProductComponent
  },
  {
    path: 'product-list',
    component: ProductListComponent
  },
  {
    path: 'edit-product/:id',
    component: AddProductComponent
  },
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routes)],
    CommonModule
  ]
})
export class InventoryManagementModule { }
