/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AccountService } from './account.service';
import { TrackingService } from './tracking.service';
import { finalize } from 'rxjs/operators';
import firebase from 'firebase/app';
import { PopoverController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../modells/user.model';
import { HttpClient } from '@angular/common/http';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';

declare let mapboxgl: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare let MapboxDirections;
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  currentPos;
  constructor(private afs: AngularFirestore,
    public popoverController: PopoverController,
    private acs: AccountService,
    private storage: AngularFireStorage,
    private router: Router,
    public toastController: ToastController,
    private http: HttpClient,
    private oneSignal: OneSignal) { }

  updatePersInfo(fg: FormGroup) {
    return this.afs.collection('user').doc(this.acs.user.id).update({
      firstname: fg.controls.firstname.value,
      lastname: fg.controls.lastname.value
    });
  }
  updateAddress(fg: FormGroup) {
    return this.afs.collection('address').doc(this.acs.user.address.id).update({
      houseNo: fg.controls.houseNo.value,
      streetName: fg.controls.streetName.value,
      town: fg.controls.town.value,
      postalCode: fg.controls.postalCode.value,
    });
  }
  updatePic(file) {
    const filePath = this.acs.user.id;
    const ref = this.storage.ref('' + filePath);
    const task = ref.put(file);
    task.snapshotChanges().pipe(finalize(() => {
      ref.getDownloadURL().subscribe(url => {
        this.afs.collection('').doc(this.acs.user.id).update({
          imgURL: url,
        }).then(() => {
          this.popoverController.dismiss();
          this.ourToast('Profile picture updated', 'success');

        }).catch(async error => {
          this.ourToast(error.message, 'danger');
        });

      });
    })).subscribe();

  }

  async ourToast(message, color) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color
    });
    toast.present();
  }

  async requestAmbulance(reason: string[]) {
    this.getCurrentLocation().then(async res => {
      const ambId = await this.searchNearestAmbulance();
      this.afs.collection('ambulance_request').add({
        userId: this.acs.user.id,
        ambulanceId: ambId,
        createdAt: new Date(),
        geo: res,
        reason: reason[0]
      }).then(async _ => {
        this.ourToast('Ambulance requested', 'success');
        await Promise.all([
          this.sendNotification([this.acs.user.nextOfKin?.playerId], 'Next of kin test mode')
        ]);
      }).catch(error => {
        this.ourToast('Something wrong happened', 'danger');
      });
    });
  }

  searchNearestAmbulance(): Promise<any> {
    let lowestDistance = 1_000_000;
    let ambulance: any;
    let id: string;
    return new Promise(resolve => {
      this.afs.collection('ambulance', ref => ref.where('status', '==', 'available')).snapshotChanges().subscribe(results => {
        for (const res of results) {
          const ambiPos = new mapboxgl.LngLat((res.payload.doc.data() as any).geo.longitude, (res.payload.doc.data() as any).geo.latitude);
          const distance = this.currentPos.distanceTo(ambiPos);
          if (distance < lowestDistance) {
            lowestDistance = distance;
            ambulance = res.payload.doc.data();
            id = res.payload.doc.id;
          }
        }

        this.afs.collection('driver').doc(ambulance.driverId).snapshotChanges().subscribe(async driverres => {
          await this.sendNotification([(driverres.payload.data() as any).playerid], 'Driver Test mode').then(_ => {
            resolve(id);
          });
        });
      });
    });
  }

  sendNotification(playerids: string[], message) {
    const osn: OSNotification = {
      app_id: environment.appId,
      include_player_ids: playerids,
      contents: {
        en: message
      }
    };
    return this.oneSignal.postNotification(osn);

  }

  getCurrentLocation(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        this.currentPos = new mapboxgl.LngLat(lon, lat);
        resolve([lat, lon]);
      });
    });
  }

  getNextOfKins() {
    return this.afs.collection('user').snapshotChanges();
  }

  addNextOfKin(nxtKin: User) {
    return this.afs.collection('user').doc(this.acs.user.id).update({
      nxtKinId: nxtKin.id
    });
  }

  deleteNxtKin() {
    return this.afs.collection('user').doc(this.acs.user.id).update({
      nxtKinId: '',
    });
  }

  getAmublanceRequests() {
    return this.afs.collection('ambulance_request', ref => ref.where('userId', '==', this.acs.user.id)).snapshotChanges();
  }

  getAmbulance(id: string): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('ambulance').doc(id).snapshotChanges().subscribe(data => {
        resolve(data);
      });
    });
  }

  getAmbulanceDriver(id: string): Promise<any> {
    return new Promise(resolve => {
      this.afs.collection('driver').doc(id).snapshotChanges().subscribe(data => {
        resolve(data);
      });
    });
  }

  cancel(id: string) {
    return this.afs.collection('ambulance_request').doc(id).delete();
  }

  getAmbulanceCoordinates(id: string) {
    return this.afs.collection('ambulance').doc(id).snapshotChanges();
  }

}
