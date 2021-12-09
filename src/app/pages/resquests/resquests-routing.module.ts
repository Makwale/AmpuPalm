import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResquestsPage } from './resquests.page';

const routes: Routes = [
  {
    path: '',
    component: ResquestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResquestsPageRoutingModule {}
