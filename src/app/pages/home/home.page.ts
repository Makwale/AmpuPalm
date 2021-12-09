import { Component, DoCheck, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from 'src/app/services/account.service';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

declare let mapboxgl: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, DoCheck {
  constructor(
    public modalController: ModalController,
    private dbs: DatabaseService,
    private router: Router,
    private auth: AuthService,
    private acs: AccountService,
    private oneSignal: OneSignal,
    private afs: AngularFirestore,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private speechRecognition: SpeechRecognition) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
  }

  ngDoCheck() {
  }

  async requestAmbulance() {
    await this.dbs.requestAmbulance(['matches']);
    // this.speechRecognition.isRecognitionAvailable()
    //   .then((available: boolean) => {
    //     if (available) {
    //       this.speechRecognition.startListening().subscribe((matches: string[]) => {
    //         this.dbs.requestAmbulance(matches);
    //       }, (onerror) => {
    //         console.log('error:', onerror);
    //       }
    //       );
    //     }
    //   });
  }

}
