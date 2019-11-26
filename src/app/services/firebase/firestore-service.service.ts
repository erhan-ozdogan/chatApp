import { Injectable } from '@angular/core';
import { AngularFireModule } from "angularfire2";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import {user} from '../SQLite/sqlite.service'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreServiceService {

   userCollection:AngularFirestoreCollection<user>;
   users:Observable<user[]>;
  constructor(private db: AngularFirestore ) { 
    this.userCollection = db.collection<user>('afadApp');
    this.users=this.userCollection.valueChanges();

  }
  addUser(user:user){
   let x= this.userCollection.doc(user.phone).set(user);
   return x;
  }
}
