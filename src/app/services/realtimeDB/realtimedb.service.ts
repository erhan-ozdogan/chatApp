import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { message } from "../SQLite/sqlite.service";
import { SQLiteService } from "../SQLite/sqlite.service";
import { MessagesPage } from "../../chat/messages/messages.page";
import { MessagesPageModule } from 'src/app/chat/messages/messages.module';
import { BehaviorSubject } from 'rxjs';

export interface fbmsg{
  from:string,
  createdAt:number,
  message:string
}

@Injectable({
  providedIn: 'root'
})
export class RealtimedbService {

  message:message[]=[];
  msg:message={
    to:'',
    from:'',
    createdAt:0,
    message:''
  }
  incomemsg:fbmsg;

  constructor(public rdb: AngularFireDatabase,private sqliteService:SQLiteService) { }

  sendMessage(to:String,from:String,message:String,createdAt:number){
    let url='/messages/'+to;
    return this.rdb.list(url).push({
      from:from,
      message:message,
      createdAt:createdAt
    })
  }
// mainden bir boolean değer göndererek ilk alınanın veritabanına eklenmesi engellenebilir.
  listenForMessage(){
    this.rdb.list('/messages/+905389640431').valueChanges().subscribe(message =>{
      if(message.length>0){
      console.log(message[message.length-1]);
      this.incomemsg=JSON.parse(JSON.stringify(message[message.length-1]));
      this.msg={
        to:'+905389640431', //current user
        from:this.incomemsg.from,
        message:this.incomemsg.message,
        createdAt:this.incomemsg.createdAt
      }
      this.sqliteService.addMessage(this.msg);
    }
    },error=>{console.log(error)}
    );}
  


}

