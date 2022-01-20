import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Address } from './modells/address.model';
import { User } from './modells/user.model';
import { AccountService } from './services/account.service';
import { AuthService } from './services/auth.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { LoadingController } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { DatabaseService } from './services/database.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [StatusBar]
})
export class AppComponent implements OnInit {
  constructor(
    private statusBar: StatusBar,
    private auth: AngularFireAuth,
    private router: Router,
    private acs: AccountService,
    private afs: AngularFirestore,
    private speechRecognition: SpeechRecognition,
    public loadingController: LoadingController,
    private oneSignal: OneSignal,
    private as: AuthService,
    private dbs: DatabaseService) { }
  async ngOnInit() {

    this.oneSignal.startInit(environment.appId, environment.projectId);
    this.oneSignal.endInit();
    // this.statusBar.overlaysWebView(false);
    // this.statusBar.backgroundColorByHexString('#031b36');
    // await this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
    //   if (!hasPermission) {
    //     this.speechRecognition.requestPermission();
    //   }
    // });
    const loading = await this.loadingController.create({
      spinner: 'dots',
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 5000
    });
    await loading.present();


    this.auth.authState.subscribe(async user => {
      if (user) {
        await this.oneSignal.getIds().then(async oneSignalRes => {
          await this.afs.collection('driver').doc(user.uid).update({
            playerid: oneSignalRes.userId
          });
        });
        this.acs.loginStatus = true;
        this.afs.collection('driver').doc(user.uid).snapshotChanges().subscribe(async results => {
          this.afs.collection('ambulance', ref => ref.where('driverId', '==', user.uid)).snapshotChanges().subscribe(ambiData => {
            const userdata: User = results.payload.data() as User;
            userdata.id = user.uid;
            userdata.ambiId = ambiData[0]?.payload.doc.id;
            userdata.ambulance = {
              regno: (ambiData[0]?.payload.doc.data() as any).regno,
              status: (ambiData[0]?.payload.doc.data() as any).status
            };
            console.log(userdata);
            this.acs.user = userdata;
            this.acs.loginStatus = true;
            loading.dismiss();
            if (!this.dbs.isTracking) {
              this.router.navigateByUrl('menu/home');
            }
          });

        });
      } else {
        this.router.navigateByUrl('menu/signin');
      }
    });
  }
}
