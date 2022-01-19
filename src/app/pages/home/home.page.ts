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

  async ngDoCheck() {

  }

  async requestAmbulance() {
    // await this.dbs.requestAmbulance(['matches']);
    this.speechRecognition.isRecognitionAvailable().then((available: boolean) => {
      if (available) {
        this.speechRecognition.requestPermission().then(
          () => {
            this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
              if (hasPermission) {
                this.speechRecognition.startListening(
                  {
                    language: 'en-US',
                    matches: 5,
                    showPartial: true
                  }).subscribe((matches: string[]) => {
                    this.dbs.requestAmbulance(matches);
                  });
              } else {
                this.dbs.ourToast('Has no permision', 'danger');
              }
            });

          },
          () => this.dbs.ourToast('Access Denied', 'danger'));
      } else {
        this.dbs.ourToast('Speech recognition not available', 'danger');
      }
    });

    // this.speechRecognition.isRecognitionAvailable()
    //   .then((available: boolean) => {
    //     if (available) {
    //     }
    //   }).catch(error => {
    //     this.dbs.ourToast(error, 'danger');
    //   });
  }

}
