import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class RealtimedbService {

  constructor(public rdb: AngularFireDatabase) { }

  sendMessage(to:String,from:String,message:String){
    return this.rdb.list('/messages').push({
      to:to,
      from:from,
      mesasge:message
    })
  }
}

