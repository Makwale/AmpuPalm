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
    private speechRecognition: SpeechRecognition) { }
  async ngOnInit() {
    // this.statusBar.overlaysWebView(false);
    // this.statusBar.backgroundColorByHexString('#031b36');
    // await this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
    //   if (!hasPermission) {
    //     this.speechRecognition.requestPermission();
    //   }
    // });

    this.auth.user.subscribe(user => {
      if (user) {
        this.afs.collection('user').doc(user.uid).snapshotChanges().subscribe(results => {
          const userdata: User = results.payload.data() as User;
          userdata.id = user.uid;
          this.afs.collection('address', ref => ref.where('userid', '==', user.uid)).snapshotChanges().subscribe(addressResults => {
            userdata.address = addressResults[0].payload.doc.data() as Address;
            userdata.address.id = addressResults[0].payload.doc.id;
            if (userdata.nxtKinId) {
              this.afs.collection('user').doc(userdata.nxtKinId).snapshotChanges().subscribe(nxtKinData => {
                userdata.nextOfKin = nxtKinData.payload.data();
                userdata.nextOfKin.id = userdata.nxtKinId;
                this.acs.user = userdata;
                this.acs.loginStatus = true;
                this.router.navigateByUrl('menu/home');
              });
            } else {
              this.acs.user = userdata;
              this.acs.loginStatus = true;
              this.router.navigateByUrl('menu/home');
            }
          });
        });
      } else {
        this.router.navigateByUrl('menu/signup');
      }
    });
  }
}
