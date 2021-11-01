import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchbusPageRoutingModule } from './searchbus-routing.module';

import { SearchbusPage } from './searchbus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchbusPageRoutingModule
  ],
  declarations: [SearchbusPage]
})
export class SearchbusPageModule {}
