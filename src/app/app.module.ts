import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupPage } from './pages/signup/signup.page';
import { SigninPage } from './pages/signin/signin.page';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AuthService } from './services/auth.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const firebaseConfig = {
  apiKey: 'AIzaSyCvsvYeDkWYPNVJdVtdFvt7PpQirycbaxI',
  authDomain: 'bus-project-52efc.firebaseapp.com',
  projectId: 'bus-project-52efc',
  storageBucket: 'bus-project-52efc.appspot.com',
  messagingSenderId: '789865770058',
  appId: '1:789865770058:web:7fa8ee99ecfaa262ad4ab3',
  measurementId: 'G-Z3FSFN8C7X'
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
  providers: [OneSignal, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FormBuilder, AuthService, BarcodeScanner],
  bootstrap: [AppComponent],
})
export class AppModule { }
