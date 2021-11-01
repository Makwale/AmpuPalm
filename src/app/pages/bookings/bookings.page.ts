import { Component, Input, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/app/modells/booking.model';
import { DatabaseService } from 'src/app/services/database.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { AlertController } from '@ionic/angular';
import { Slot } from 'src/app/modells/slot.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, DoCheck{
 
  bookings: Booking[]

  constructor(private router: Router, private dbs: DatabaseService, private ts: TrackingService,
     public alertController: AlertController, private acs: AccountService) { }

  ngOnInit() {
   
    this.dbs.counter = 3;
    
  
  }

  ionViewDidEnter(){
    this.bookings = this.dbs.bookings.filter(booking => (booking.studentId == this.acs.user.id) && !booking.cancelled && (<Slot>booking.slot).date >= new Date());

  }

  ngDoCheck(){
    this.bookings = this.dbs.bookings.filter(booking => (booking.studentId == this.acs.user.id) && !booking.cancelled && (<Slot>booking.slot).date >= new Date());
    
  }

  ionViewWillLeave(){
    this.dbs.counter = 0;
    this.bookings = [];
  }


  navigate(booking: Booking){
    this.ts.slot = booking.slot;
    this.router.navigateByUrl('map')
  }

  async cancel(bkng: Booking){

    
      const alert = await this.alertController.create({
        cssClass: "booking-cancel",
        header: 'Booking Cancelation',
        message: 'Are you sure?',
        buttons:  [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              
            }
          }, {
            text: 'Yes',
            handler: () => {
              
              this.dbs.cancel(bkng).then(() => {
                this.dbs.bookings.filter( book => {
                  if(book.id == bkng.id){
                    book.cancelled = true;
                  }
                })
                this.dbs.updateSlotCancelation(bkng)
                

              }).catch( error => {
                this.dbs.bookingToast(error.message, 'danger')
          
              })   
              
            }
          }
        ]
      });
  
      await alert.present();
  
  }

}
