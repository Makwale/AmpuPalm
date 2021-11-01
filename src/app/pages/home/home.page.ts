import { Component, DoCheck } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchbusPage } from '../searchbus/searchbus.page';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Slot } from 'src/app/modells/slot.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AccountService } from 'src/app/services/account.service';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements DoCheck {
  slots: Slot[] = [];
  dis = true
  
  loading;
  constructor(public modalController: ModalController, private dbs: DatabaseService,
    private router: Router, private auth: AuthService, private acs: AccountService,
    private oneSignal: OneSignal, private afs: AngularFirestore,
    public toastController: ToastController, public loadingController: LoadingController) {}

  ngOnInit() {
    
   
    
  }

  ionViewDidEnter(){
      
   
    // if(!this.dbs.isFirstOpened){
    //   // this.loader();
    //   this.dbs.isFirstOpened = true;
    //  }
    // setTimeout(() => {
    //   // this.slots = this.dbs.slots;
    //   this.loading.dismiss();
    //   console.log(this.slots)
    // }, 2000)

    setInterval(() => {
      this.slots = this.dbs.slots.filter(slot => slot.date > new Date());
    },1000)
    
  }

  ngDoCheck(){

    for (let index = 0; index < this.slots.length; index++) {
      if((this.slots[index].availableSeats != this.dbs.slots[index].availableSeats) 
        || (this.slots[index].from != this.dbs.slots[index].from) ||
        (this.slots[index].to != this.dbs.slots[index].to) || 
        (this.slots[index].date != this.dbs.slots[index].date) ){

        this.slots.forEach( slot => {
          if(slot.id == this.dbs.slots[index].id) slot = this.dbs.slots[index]
        })
      }
    }

    
  
    this.slots.sort((a, b) => {
      if(a.date < b.date){
        return -1
      }else if( a.date > b.date){
        return 1
      }
  
      return 0
    })
  }

  async book(slot: Slot){
    
    if(this.acs.loginStatus){

      this.dbs.book(slot.id);
      
    }else{
      const toast = await this.toastController.create({
        message: 'Sign in and start booking',
        duration: 3000,
        color: "warning"
      });
      toast.present();
    }
    
  }

  async loader(){
   
      this.loading = await this.loadingController.create({
        spinner: "bubbles",
        message: 'Please wait...',
      });
      await this.loading.present();
    
      
  }

}
