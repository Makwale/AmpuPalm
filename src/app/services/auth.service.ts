import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';

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



declare let mapboxgl: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  clicked = false;
  constructor(private afa: AngularFireAuth, private afs: AngularFirestore,
    private acs: AccountService, private router: Router, private dbs: DatabaseService,
    public alertController: AlertController,
    private toastController: ToastController) {

    // mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsbWFrd2FsZSIsImEiOiJja2hsc3lmYWUyZzRnMnRsNnY2NWIyeGR6In0.1MGnfpXj_dV2QBO3SchfqA';

  }

  signIn(email, password) {
    this.clicked = true;

    this.afa.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.acs.loginStatus = true;
        this.router.navigateByUrl('/menu/home');
      }).catch(error => {

        this.clicked = false;

        this.ourToast(error.message, 'danger');

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

    this.afa.createUserWithEmailAndPassword(signUpForm.controls.email.value, signUpForm.controls.password.value).then(userCredentials => {
      const id = userCredentials.user.uid;
      this.afs.collection('user').doc(id).set({
        firstname: signUpForm.controls.firstname.value,
        lastname: signUpForm.controls.lastname.value,
        email: signUpForm.controls.email.value,
        imgURL: '',
        nxtKinId: ''
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

  getNextOfKin(id: string) {
    return this.afs.collection('user').doc(id).snapshotChanges();
  }
}
