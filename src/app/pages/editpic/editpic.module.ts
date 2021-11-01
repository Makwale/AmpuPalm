import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditpicPageRoutingModule } from './editpic-routing.module';

import { EditpicPage } from './editpic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditpicPageRoutingModule
  ],
  declarations: [EditpicPage]
})
export class EditpicPageModule {}
