import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  constructor(private dbs: DatabaseService, private afs: AngularFirestore) { }

  getBusCoordinates() {
  }
}
