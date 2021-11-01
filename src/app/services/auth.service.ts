import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import  firebase from 'firebase/app';
import { OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';

import { AngularFirestore, 
  AngularFirestoreCollection,
   AngularFirestoreDocument } from '@angular/fire/firestore';
import { AccountService } from './account.service';
import { Student } from '../modells/student.model';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { Driver } from '../modells/driver.model';
import { Slot } from '../modells/slot.model';
import { Booking } from '../modells/booking.model';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from '../modells/user.model';
import { Bus } from '../modells/bus.model';



declare var mapboxgl: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  app_id = '71afca4e-2383-4fbe-811f-31802cd32e2a';
  
  project_id = '789865770058';

  slots: Slot[] = []

  bookingsDriver: Booking[] = [];

  studentsBooked: Student[] = [];

  clicked = false;

  trackingSlotId;

  toCoordinates = [];

  studentNumbers = []

  campusesLocations = [
    {name: "Sosh South",
     geo:[28.09707, -25.53942]
    },
    {name: "Sosh North",
     geo:[28.11295, -25.52039]
    },
    {
      name: "Pta Main",
      geo: [28.16242, -25.73176]
    },
    {
      name: "Pta Main",
      geo: [28.16242, -25.73176]
    },
    {
      name: "Arcadia",
      geo: [28.20040, -25.74477]
    },
    {
      name: "Garankuwa",
      geo: [28.00317, -25.61617]
    },
    {
      name: "Art",
      geo: [28.19671, -25.74003]
    },
    {
      name: "Valotorque Res",
      geo: [28.17716, -25.67368]
    }
    
  ]
  playerid: string = "";

  constructor(private afa: AngularFireAuth, private afs: AngularFirestore,
     private acs: AccountService, private router: Router, private dbs: DatabaseService,
     public alertController: AlertController,
     private oneSignal: OneSignal, private toastController: ToastController) { 

      // mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsbWFrd2FsZSIsImEiOiJja2hsc3lmYWUyZzRnMnRsNnY2NWIyeGR6In0.1MGnfpXj_dV2QBO3SchfqA';

     }

  signIn(email, password) {    

    this.oneSignal.startInit(this.app_id, this.project_id)
    
    this.oneSignal.endInit()

    this.clicked = true;

    this.afa.signInWithEmailAndPassword(email, password)
    .then(res => {  

      this.afs.collection("Student").doc(res.user.uid).update({
        playerid: this.playerid
      })

      
      this.afs.collection("Student").doc(res.user.uid).valueChanges().subscribe(data => {
        this.acs.user = new Student(res.user.uid, data["firstname"], data["lastname"], data["studentNumber"],
        data["email"], data["imgURL"], data["playerid"]);
        this.dbs.getBookings();

        this.acs.loginStatus = true;
        this.clicked = false;
        this.router.navigateByUrl("")
      })

    }).catch(error =>{

      this.clicked = false

      this.ourToast(error.message, 'danger')

    })
    
  }

  signInDriver(email, password){
    let isAuthorized = false;

    this.clicked = true;
    
    this.afa.signInWithEmailAndPassword(email, password).then( res => { 

      isAuthorized = true;

      this.afs.collection("Driver").doc(res.user.uid).valueChanges().subscribe( data => {
        
        if(data != undefined){
          
          

          this.afs.collection("Bus", ref => ref.where("driverid", "==", res.user.uid))
          .snapshotChanges().subscribe(bdata => {

            if(bdata.length > 0 ){

              

              let bus = new Bus(bdata[0].payload.doc.id, bdata[0].payload.doc.data()["driverid"])
 
              this.acs.user = new Driver(res.user.uid, data["firstname"], data["lastname"], data["phone"],
              data["email"], data["imgURL"], bus);

              
              setTimeout(() => {
                this.clicked = false;
                this.acs.loginStatus = true;

                this.router.navigateByUrl("menudriver")
              },3000)
             

              this.getBookingsSlot()
              
            }else{

         

              this.acs.user = new Driver(res.user.uid, data["firstname"], data["lastname"], data["phone"],
              data["email"], data["imgURL"], null);
              setTimeout(() => {
                this.acs.loginStatus = true;
                this.clicked = false;

                this.router.navigateByUrl("home")
              },3000)
            }
           
          })
         
          
        }else{
          this.clicked = false

          this.ourToast('Unauthorised user', 'danger')
        }
       
      })

    }).catch(error =>{
        this.clicked = false;
        if(!isAuthorized){
          this.ourToast(error.message, 'danger')
        }
    })
  }
 
  async ourToast(message, color){
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  signup(name: string, surname: string, studn: number, email: string, password: string) {

    this.clicked = true;
        
        this.afa.createUserWithEmailAndPassword( email, password).then( userCredentials => {
          let id = userCredentials.user.uid;
          this.afs.collection("Student").doc(id).set({
            firstname: name,
            lastname: surname,
            studentNumber: studn,
            email: email,
            imgURL: "",
            playerid: this.playerid
          }).then( res => {
            this.clicked = false;
  
            this.router.navigateByUrl("signin")
          }).catch( async error => {
           
            const toast = await this.toastController.create({
              message: error.message,
              duration: 4000,
              color: "danger"
            });
  
            toast.present();
            this.clicked = false;
          })
    
        }).catch( async error => {
          const toast = await this.toastController.create({
            message: error.message,
            duration: 4000,
            color: "danger"
          });
          toast.present();
          this.clicked = false;
        })
 
     
  }

  getSlotsDriver(){
    

      this.afs.collection("Slot").snapshotChanges().
      subscribe(data => {
        for(let slotdata of data){
          let slot = new Slot(slotdata.payload.doc.id, slotdata.payload.doc.data()["date"],
          slotdata.payload.doc.data()["busid"],
         slotdata.payload.doc.data()["geo"], slotdata.payload.doc.data()["avail"],
          slotdata.payload.doc.data()["booked"], slotdata.payload.doc.data()["from"],
           slotdata.payload.doc.data()["to"], slotdata.payload.doc.data()["gps"])

           if(!this.searchSlot(slot)){
             if((<Driver>this.acs.user).bus.id == slot.bus){
              if(!slotdata.payload.doc.data()["delivered"]){
                this.slots.push(slot)
              }
                

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

  getBookingsSlot(){

    this.afs.collection("Booking").snapshotChanges().
    subscribe(data => {
    
      for(let bdata of data){
        let booking = new Booking(bdata.payload.doc.id, bdata.payload.doc.data()["slotid"], bdata.payload.doc.data()["studentid"],
        bdata.payload.doc.data()["studentNumber"],bdata.payload.doc.data()["playerid"],bdata.payload.doc.data()["cancelled"])
  
         if(!booking.cancelled){
           if(!this.searchBookingDuplicates(booking)){

             this.bookingsDriver.push(booking)
           }
          
         }
        
      }
    })
  }

  

  searchBookingDuplicates(booking: Booking){
    for(let book of this.bookingsDriver){
      if(booking.id == book.id){
        return true;
      }
    }

    return false;
  }

  searchStudentBooked(student: Student){
    for(let stud of this.studentsBooked){
      if(stud.id ==  student.id){
        return true
      }
    }

    return false;
  }

  checkStudentIn(slotId,studentNumber){

    let isFound = false;

    for(let booking of this.bookingsDriver){
      if(booking.slot == slotId && booking.studentNumber == studentNumber && !booking.cancelled){
        this.afs.collection("Booking").doc(booking.id).update({
          checkedin: true
        })
        isFound = true;
        this.ourToast("Student checked in", "success")
        break;
      }
    }

    if(!isFound){
      this.ourToast("Student not found on this slot bookings " + String(studentNumber), "danger")
    }
  }


  updateGeoSlot(slot : Slot){

    for(let cl of this.campusesLocations){
      if(cl.name == slot.to){
        this.toCoordinates = cl.geo;
        break;
      }
    }

    let playerids: string[] = []
   
    for(let bd of this.bookingsDriver){

      if(bd.slot == slot.id && !bd.cancelled){
        if(bd.playerid != ""){
          playerids.push(bd.playerid)
        }
      }
    }


    this.trackingSlotId = slot.id;

   
    this.afs.collection("Slot").doc(this.trackingSlotId).update({
      gps: slot.gps
    }).then(() =>{
    
      if(slot.gps){

        this.ourToast("Bus GPS enabled", "success")
      }else{
        this.ourToast("Bus GPS disabled", "success")

      }
    })

    //For testing purposes
    // let destination;

    // for(let camp of this.campusesLocations){
    //   if(camp.name == slot.to){
    //     destination = new mapboxgl.LngLat(camp.geo[0], camp.geo[1]);
    //     break;
    //   }
    // }

    // let x = 1

    // this.oneSignal.startInit(this.app_id, this.project_id)

    // this.oneSignal.endInit()

    // this.afs.collection("Slot").doc(this.trackingSlotId).snapshotChanges().subscribe(data =>{

    //       let busdata = data.payload.data();
    //       let geo = busdata["geo"];

    //       let busLocation = new mapboxgl.LngLat(geo[0], geo[1]);
          
    //       let distance = busLocation.distanceTo(destination)

    //       if(distance < 1500){
           
    //           let osn: OSNotification = {
    //             app_id: this.app_id,
    //             include_player_ids: playerids,
    //             contents: {
    //               "en": `Your bus that leaves from ${slot.from} to ${slot.to} at 
    //               ${slot.date.toLocaleTimeString()} is less than 1.5 km(s) away to bus terminal. Be ready!`
    //             }
    //           }
              
    //           if(x == 1){
    //             this.oneSignal.postNotification(osn).then(() => {
    //               x++;
    //             }).catch(error => {
    //               // this.ourToast(error.message, 'danger')
    //             })
    //           }
           
          
    //     }
    
    //   })



    //THE ACTUAL CODE

    let didSend = false;

    let destination = new mapboxgl.LngLat(this.toCoordinates[0], this.toCoordinates[1]);

    navigator.geolocation.watchPosition(pos => {
      
      let busLocation = new mapboxgl.LngLat(pos.coords.longitude, pos.coords.latitude);

      let distance = busLocation.distanceTo(destination)


      if(distance < 1500){

        if(!didSend){

          let osn: OSNotification = {
            app_id: this.app_id,
            include_player_ids: playerids,
            contents: {
              "en": "Bus from  your bus is less than 1.5km away. Be ready!!"
            }
          }
  
          this.oneSignal.postNotification(osn).then(() => {
           
            this.ourToast("Notifications sent to students", "success")
          }).catch(error => {
            this.ourToast(error.message, "danger")
          })

          didSend = true;
        }
      }

      this.afs.collection("Slot").doc(this.trackingSlotId).update({
        geo: [pos.coords.longitude, pos.coords.latitude]
      })
    })

 


    // this.oneSignal.startInit(this.app_id, this.project_id)

    // this.oneSignal.endInit()

    // let distance = 1000;

    // if(distance < 1500){
    //     let osn: OSNotification = {
    //       app_id: this.app_id,
    //       include_player_ids: playerids,
    //       contents: {
    //         "en": `Your bus that leaves from ${slot.from} to ${slot.to} at 
    //         ${slot.date.toLocaleTimeString()} is less than 1.5km(s) away to bus terminal. Be ready!`
    //       }
    //     }

    //     this.oneSignal.postNotification(osn).then(() => {
       
    //     }).catch(error => {
    //       // this.ourToast(error.message, 'danger')
    //     })
    // }
   
  }





  

  updateInfor(name, surname, phone){

    this.afs.collection("Driver").doc(this.acs.user.id).update({
      firstname: name,
      lastname: surname,
      phone: phone
    }).then(() => {
      this.acs.user.lastname = name;
      this.acs.user.lastname = surname;
      (<Driver>this.acs.user).phone = phone;

      this.ourToast("Profile updated", "success")
  
    }).catch(err => {
      this.ourToast(err.message, err.message)
    })
  }

  getSignedUpStudents(){
    this.afs.collection("Student").snapshotChanges().subscribe(data => {

      this.studentNumbers = data.map(d => d.payload.doc.data()["studentNumber"])
      
    
    })
  }

  confirmDelivery(id){
    this.afs.collection("Slot").doc(id).update({
      delivered: true
    })

    this.slots.filter( slot => {
      if(slot.id == id){
        slot.delivered = true
      }
    })
  }
}
