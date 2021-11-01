import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Slot } from '../modells/slot.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  slot: Slot;
  constructor(private dbs: DatabaseService, private afs: AngularFirestore) { }

  // track(){
  //   if(this.slot != undefined){
  //     this.dbs.getSlotGeo(this.slot.id).snapshotChanges().subscribe(data =>{
  //       this.slot.geo[0] = data.payload.data()["geo"][0]
  //       this.slot.geo[1] = data.payload.data()["geo"][1]
  //     })
  //   }
    
  // }

  getBusCoordinates(){
    return this.afs.collection("Slot").doc(this.slot.id).snapshotChanges()  
  }

  
}
