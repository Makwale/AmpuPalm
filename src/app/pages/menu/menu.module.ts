import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';
import { MenuPage } from './menu.page';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule
  ],
  declarations: [MenuPage],
  providers: [OneSignal, SpeechRecognition]
})
export class MenuPageModule { }
