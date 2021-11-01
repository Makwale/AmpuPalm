import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Booking } from '../modells/booking.model';
import { Bus } from '../modells/bus.model';
import { Slot } from '../modells/slot.model';
import { AccountService } from './account.service';
import { TrackingService } from './tracking.service';
import { finalize } from 'rxjs/operators';
import firebase from 'firebase/app';
import { PopoverController, ToastController } from '@ionic/angular';
import { Student } from '../modells/student.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  slots: Slot[]= []
  slotsDriver: Slot[] = [];
  bookings: Booking[] = [];
  tempBookings: Booking[] = [];
  isSlotUpdated = false;
  isBookingUpdated = false;
  counter = 0;
  isFirstOpened = false;

  constructor(private afs: AngularFirestore,public popoverController: PopoverController, 
    private acs: AccountService, private storage: AngularFireStorage, private router: Router,
  public toastController: ToastController) { }

  getSlots(){
   
    this.afs.collection("Slot").snapshotChanges().subscribe(data => {
      this.slots = [];
      for(let slotd of data){

        let slotid = slotd.payload.doc.id;
        let slotdata = slotd.payload.doc.data()
       
        let slot = new Slot(slotid, slotdata["date"], slotdata["busid"],
        slotdata["geo"], slotdata["avail"], slotdata["booked"], slotdata["from"], slotdata["to"],null, slotdata["delivered"])

        if(!this.searchSlot(slot)){
          if(!slotdata["delivered"]){
            this.slots.push(slot);
          }
        
        }
         
          
        
      }
    })
  }

  searchSlot(tempSlot: Slot){
    for(let slot of this.slots){
      if(slot.id == tempSlot.id) return true
    }

    return false
  }

  async book(slotId){


    if(!this.preventDuplicates(slotId, this.acs.user.id)){
      if(!this.isStudentBookedBefore(slotId, this.acs.user.id)){
       
        this.afs.collection("Booking").add({
          slotid: slotId,
          studentid: this.acs.user.id,
          date: new Date(),
          studentNumber: (<Student>this.acs.user).studentNumber,
          playerid: this.acs.user.playerid,
          checkedin: false
        }).then(async res => {
          
          this.updateSlotBooking(slotId);
          
        }).catch( error => {
          this.bookingToast(error.message, 'warning')
        })
      }else{
        
        this.updateSlotBooking(slotId)
      }
     
    }else{
      this.bookingToast('You already booked on this slot', 'warning')
    }
    
  }

  async bookingToast(message, color){
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  getBookings(){
      this.afs.collection("Booking").snapshotChanges().subscribe(data => {
       
        for(let book of data){

          let bookingId = book.payload.doc.id;
          let bookingData = book.payload.doc.data();
          
          this.afs.collection("Slot").doc(bookingData["slotid"]).snapshotChanges().subscribe(data => {
           
              let slotid = data.payload.id;
              let slotdata = data.payload.data()
             
              let slot = new Slot(slotid, slotdata["date"], slotdata["busid"],
              slotdata["geo"], slotdata["avail"], slotdata["booked"], slotdata["from"], slotdata["to"])
      
              let booking = new Booking(bookingId, slot , bookingData["studentid"],
              bookingData["studentNumber"],bookingData["playerid"], bookingData["cancelled"], bookingData['date']);
              
              if(this.counter == 0){

                if(!this.searchBooking(booking)){
                  if(!booking.cancelled && !bookingData['checkedin']){ 
                    this.bookings.push(booking)
                    
                  }
                }
              }
              this.tempBookings.push(booking)
          })
      
        }

        
      })
    
    
   
  }

  isStudentBookedBefore(slotid, studid){
    
      for(let booking of this.tempBookings){

        if(booking.slot.id == slotid && booking.studentId == studid ){
          this.afs.collection("Booking").doc(booking.id).update({
            cancelled: false
          })

          this.tempBookings.filter(booking => {
            if(booking.slot.id == slotid && booking.studentId == studid){
              booking.cancelled = false;
            }
          })
        
          return true
        }
      }
  
    return false;
  }

  preventDuplicates(id, stid){
    
   for(let booking of this.bookings){
     if(booking.slot.id == id && booking.studentId == stid && !booking.cancelled){
  
       return true
     }
   }
   
   return false
  }

  updateSlotBooking(id){
   
    for(let slot of this.slots){
      if(slot.id == id){
        let avails = slot.availableSeats - 1;
        let bookeds = slot.bookedSeats + 1;
        this.afs.collection("Slot").doc(id).update({
          avail: avails,
          booked: bookeds
        }).then(res => {
         
          this.bookingToast('Your booking is successful', 'success')

        }).catch( error => {
          this.bookingToast(error.message, 'danger')
        })
      }
    }
  }

  updateSlotCancelation(booking: Booking){

    
    for(let slot of this.slots){
      if(slot.id == booking.slot.id){
        let avails = slot.availableSeats + 1;
        let bookeds = slot.bookedSeats - 1;
        
        this.afs.collection("Slot").doc(slot.id).update({
          avail: avails,
          booked: bookeds
        }).then(res => {
          
          this.bookingToast('Your booking is cancelled', 'success')

         for(let i = 0; i < this.bookings.length; i++){
           
          if(this.bookings[i].id == booking.id){
            this.bookings[i].cancelled = true;
          }
         
         }

      
        }).catch( error => {
  
          this.bookingToast(error.message, 'danger')

        })
      }
    }

   
  }

  searchBooking(tempBookings: Booking){

    for(let booking of this.bookings){
      
      if(booking.id == tempBookings.id) return true;
    }

    return false
  }

  getSlotGeo(id){
    return this.afs.collection("Slot").doc(id);
  }

  cancel(booking: Booking){
    return this.afs.collection("Booking").doc(booking.id).update({
      cancelled: true
    })
  }

  updateInfor(name, surname, sn){

    this.afs.collection("Student").doc(this.acs.user.id).update({
      firstname: name,
      lastname: surname,
      studentNumber: sn
    }).then(() => {
      this.acs.user.lastname = name;
      this.acs.user.lastname = surname;
      (<Student>this.acs.user).studentNumber = sn;
    })
  }

  

  updatePic(file) {

    
    const filePath = this.acs.user.id;
    const ref = this.storage.ref("StudentProfile/" + filePath);
    const task = ref.put(file);
    task.snapshotChanges().pipe( finalize( () => {
  		ref.getDownloadURL().subscribe(url =>{
        this.afs.collection("Student").doc(this.acs.user.id).update({
          imgURL: url,
        }).then(() => {
          this.popoverController.dismiss();
          this.ourToast("Profile picture updated", "success")
          
        }).catch(async error => {
          this.ourToast(error.message, "danger")
        });

      })
  	})).subscribe()	
    
  }

  async ourToast(message, color){
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color
    });
    toast.present();
  }




}
