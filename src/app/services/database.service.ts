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

declare let mapboxgl: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare let MapboxDirections;
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private afs: AngularFirestore,
    public popoverController: PopoverController,
    private acs: AccountService,
    private storage: AngularFireStorage,
    private router: Router,
    public toastController: ToastController,
    private http: HttpClient) { }

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
    this.getCurrentLocation().then(res => {
      this.afs.collection('ambulance_request').add({
        userId: this.acs.user.id,
        ambulanceId: 1,
        createdAt: new Date(),
        geo: res,
        reason: reason[0]
      }).then(_ => {
        alert('requested');
        this.searchNearestAmbulance([]);
      }).catch(error => {
        alert(error.message);
      });
    });
  }

  searchNearestAmbulance(coords: any[]): Promise<any> {
    let minDistance = 1_000_000;
    let ambulance: any;
    return new Promise(resolve => {
      this.afs.collection('ambulance').snapshotChanges().subscribe(results => {
        for (const res of results) {
          const ambiPos = new mapboxgl.LngLat((res.payload.doc.data() as any).geo.longitude, (res.payload.doc.data() as any).geo.latitude);
          const userPos = new mapboxgl.LngLat((res.payload.doc.data() as any).geo.longitude, (res.payload.doc.data() as any).geo.latitude);
          const distance = userPos.distanceTo(ambiPos);
          if (distance < minDistance) {
            minDistance = distance;
            ambulance = res.payload.doc.data();
          }
        }

        this.afs.collection('driver').doc(ambulance.driverId).snapshotChanges().subscribe(async driverres => {
          await this.sendSms((driverres.payload.data() as any).phone).then(_ => {
            resolve('success');
          });
        });
      });
    });
  }

  sendSms(phone: string) {
    return new Promise(resolve => {
      this.http.post('https://yghabr9im7.execute-api.us-east-1.amazonaws.com/dev/drivers', { phone }).subscribe(_ => {
        resolve('');
      });
    });
  }

  getCurrentLocation(): Promise<any[]> {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
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

}
