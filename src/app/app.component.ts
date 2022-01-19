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

    this.auth.authState.subscribe(async user => {
      if (user) {
        const loading = await this.loadingController.create({
          spinner: 'dots',
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        await loading.present();
        await this.oneSignal.getIds().then(async oneSignalRes => {
          await this.afs.collection('user').doc(user.uid).update({
            playerid: oneSignalRes.userId
          });
        });
        console.log(user);
        this.afs.collection('user').doc(user?.uid).snapshotChanges().subscribe(results => {
          console.log(results.payload.data());
          const userdata: User = results.payload.data() as User;
          userdata.id = user?.uid;
          this.afs.collection('address', ref => ref.where('userid', '==', user.uid)).snapshotChanges().subscribe(async addressResults => {
            userdata.address = addressResults[0]?.payload.doc?.data() as Address;
            if (userdata.address) {
              userdata.address.id = addressResults[0]?.payload.doc?.id;
            }
            if (userdata.nxtKinId) {
              this.afs.collection('user').doc(userdata?.nxtKinId).snapshotChanges().subscribe(async nxtKinData => {
                userdata.nextOfKin = nxtKinData?.payload?.data();
                userdata.nextOfKin.id = userdata?.nxtKinId;
                this.acs.user = userdata;
                this.acs.loginStatus = true;
                await loading.dismiss();
                if (!this.dbs.isUpdating) {
                  this.router.navigateByUrl('menu/home');
                }
              });
            } else {
              this.acs.user = userdata;
              this.acs.loginStatus = true;
              await loading.dismiss();
              if (!this.dbs.isUpdating) {
                this.router.navigateByUrl('menu/home');
              }
            }
          });
        });
      } else {

        this.router.navigateByUrl('menu/signup');
      }
    });
  }
}
