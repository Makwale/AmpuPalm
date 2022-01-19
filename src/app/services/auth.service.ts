import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';
import { Address } from '../modells/address.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from '../modells/user.model';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';



declare let mapboxgl: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  clicked = false;
  constructor(
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private acs: AccountService,
    private router: Router,
    private dbs: DatabaseService,
    public alertController: AlertController,
    private toastController: ToastController,
    private oneSignal: OneSignal) {

    // mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsbWFrd2FsZSIsImEiOiJja2hsc3lmYWUyZzRnMnRsNnY2NWIyeGR6In0.1MGnfpXj_dV2QBO3SchfqA';

  }

  signIn(email, password) {
    this.clicked = true;
    this.oneSignal.startInit(environment.appId, environment.projectId);
    this.oneSignal.endInit();
    this.afa.signInWithEmailAndPassword(email, password)
      .then(async res => {
        await this.oneSignal.getIds().then(async oneSignalRes => {
          await this.afs.collection('driver').doc(res.user.uid).update({
            playerid: oneSignalRes.userId
          });
        });
        this.acs.loginStatus = true;
        this.afs.collection('driver').doc(res.user.uid).snapshotChanges().subscribe(async results => {
          this.afs.collection('ambulance', ref => ref.where('driverId', '==', res.user.uid)).snapshotChanges().subscribe(ambiData => {
            const userdata: User = results.payload.data() as User;
            userdata.id = res.user.uid;
            userdata.ambiId = ambiData[0]?.payload.doc.id;
            userdata.ambulance = {
              regno: (ambiData[0]?.payload.doc.data() as any).regno,
              status: (ambiData[0]?.payload.doc.data() as any).status
            };
            console.log(userdata);
            this.acs.user = userdata;
            this.acs.loginStatus = true;
            this.clicked = false;
            if (!this.dbs.isTracking) {
              this.router.navigateByUrl('menu/home');
            }
          });

        });
        if (!this.dbs.isTracking) {
          this.router.navigateByUrl('menu/home');
        }
      }).catch(error => {
        this.clicked = false;
        this.ourToast(error.message, 'danger');

      });

  }

  getAddress(id: string): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('address', ref => ref.where('userid', '==', id)).snapshotChanges().subscribe(addressResults => {
        resolve(addressResults);
      });
    });
  }

  getNextOfKin(id: string): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('user').doc(id).snapshotChanges().subscribe(nxtKinData => {
        resolve(nxtKinData);
      });
    });
  }

  async ourToast(message, color) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color
    });
    toast.present();
  }

  signup(signUpForm: FormGroup, physAddress: FormGroup, nxtKinId?: string) {

    this.clicked = true;
    this.afa.createUserWithEmailAndPassword(
      signUpForm.controls.email.value, signUpForm.controls.password.value).then(userCredentials => {
        const id = userCredentials.user.uid;
        this.afs.collection('user').doc(id).set({
          firstname: signUpForm.controls.firstname.value,
          lastname: signUpForm.controls.lastname.value,
          email: signUpForm.controls.email.value,
          imgURL: '',
          nxtKinId,
          phone: signUpForm.controls.phone.value
        }).then(res => {
          this.afs.collection('address').add({
            houseNo: physAddress.controls.houseNo.value,
            streetName: physAddress.controls.streetName.value,
            town: physAddress.controls.town.value,
            postalCode: physAddress.controls.postalCode.value,
            userid: id
          }).then(async results => {
            this.clicked = false;
            const toast = await this.toastController.create({
              message: 'Successfully signed up',
              duration: 4000,
              color: 'success'
            });
            toast.present();

            // this.router.navigateByUrl('signin');
          });

        }).catch(async error => {

          const toast = await this.toastController.create({
            message: error.message,
            duration: 4000,
            color: 'danger'
          });

          toast.present();
          this.clicked = false;
        });

      }).catch(async error => {
        const toast = await this.toastController.create({
          message: error.message,
          duration: 4000,
          color: 'danger'
        });
        toast.present();
        this.clicked = false;
      });


  }

  // getNextOfKin(id: string) {
  //   return this.afs.collection('user').doc(id).snapshotChanges();
  // }
}
