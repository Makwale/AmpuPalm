import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditpicPage } from './editpic.page';

const routes: Routes = [
  {
    path: '',
    component: EditpicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditpicPageRoutingModule {}
