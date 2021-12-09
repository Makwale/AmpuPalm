import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonicModule } from '@ionic/angular';

import { ResquestsPageRoutingModule } from './resquests-routing.module';

import { ResquestsPage } from './resquests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResquestsPageRoutingModule
  ],
  declarations: [ResquestsPage],
  providers: [CallNumber]
})
export class ResquestsPageModule { }
