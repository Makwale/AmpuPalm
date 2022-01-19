import { Component, DoCheck, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AmbulanceRequest } from '../../modells/request.model';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-resquests',
  templateUrl: './resquests.page.html',
  styleUrls: ['./resquests.page.scss'],
})
export class ResquestsPage implements OnInit, DoCheck {
  defaultPic = 'assets/driver.jpg';
  requests: AmbulanceRequest[] = [];
  loading;
  isLoading: boolean;
  constructor(
    private dbs: DatabaseService,
    private callNumber: CallNumber,
    public alertController: AlertController,
    private router: Router,
    public loadingController: LoadingController) { }

  ngOnInit() {
  }

  ngDoCheck(): void {
  }

  async ionViewDidEnter() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
    this.getRequests();
  }

  getRequests() {
    this.dbs.getAmublanceRequests().subscribe(async data => {
      console.log(data);
      for (const request of data) {
        const req: AmbulanceRequest = request.payload.doc.data();
        req.createdAt = (request.payload.doc.data() as any).createdAt.toDate();
        req.id = request.payload.doc.id;
        await this.dbs.getAmbulance((request.payload.doc.data() as any).ambulanceId).then(async ambulanceData => {
          req.ambulance = ambulanceData.payload.data();
          req.ambulance.id = ambulanceData.payload.id;
          await this.dbs.getAmbulanceDriver(ambulanceData.payload.data().driverId).then(driverData => {
            console.log(driverData.payload.data());
            req.ambulance.driver = driverData.payload.data();
            req.ambulance.driver.driverId = driverData.payload.id;
          });
        });
        if (!this.searchRequest(req)) {
          if (req.status !== 'attended') {
            this.requests.push(req);
            this.requests.sort((a, b) => {
              if (a.createdAt < b.createdAt) {
                return 1;
              }
              if (a.createdAt > b.createdAt) {
                return -1;
              }
              return 0;
            });
          }
        }
        console.log(req.ambulance);
      }
      await this.loading.dismiss();
      this.isLoading = true;
    });
  }

  searchRequest(req: AmbulanceRequest) {
    for (const request of this.requests) {
      if (request.id === req.id) { return true; }
    }
    return false;
  }


  callDriver(req: AmbulanceRequest) {
    console.log(req.ambulance.driver.phone);
    this.callNumber.callNumber('+27' + req.ambulance.driver.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async cancel(req: AmbulanceRequest) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.dbs.cancel(req.id).then(_ => {
              this.requests = this.requests.filter(request => request.id !== req.id);
              this.dbs.ourToast('Request cancelled', 'success');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillLeave() {
    this.requests = [];
  }

  track(request: AmbulanceRequest) {
    if (request.status === 'onway') {
      this.router.navigate(['menu/map'], { queryParams: { id: request.ambulance.id } });
    } else {
      this.dbs.ourToast('Ambulance GPS is currently disabled', 'warning');
    }
  }

  doRefresh(event: any) {
    this.requests = [];
    this.getRequests();
    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }
}
