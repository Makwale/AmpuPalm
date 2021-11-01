import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchbusPage } from './searchbus.page';

const routes: Routes = [
  {
    path: '',
    component: SearchbusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchbusPageRoutingModule {}
