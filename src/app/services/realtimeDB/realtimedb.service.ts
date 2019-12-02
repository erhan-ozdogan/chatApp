import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { message } from "../SQLite/sqlite.service";
import { SQLiteService } from "../SQLite/sqlite.service";
import { AuthenticationService } from "../authentication/authentication.service";
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from "../../services/notificationService/notification.service";

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
  currentUser;
  add=new BehaviorSubject<message>(null);
  isNotification=true;
  chattingUser;

  constructor(public rdb: AngularFireDatabase,private sqliteService:SQLiteService,private auth:AuthenticationService
              ,private notificationService:NotificationService) { 
    this.auth.getUser().then(res =>{this.currentUser=res;console.log("console",res)});
  }

  sendMessage(to:String,from:String,message:String,createdAt:number){
    let url='/messages/'+to;
    return this.rdb.list(url).push({
      from:from,
      message:message,
      createdAt:createdAt
    })
  }
  // constructadaki üsttekiyle değiş
// mainden bir boolean değer göndererek ilk alınanın veritabanına eklenmesi engellenebilir.
//mainde ilk çağırıldığında mesajları çekiyor bu yüzden son mesajı tekrar sqlit db ye kayıt ediyor buda çift mesaja neden oluyor
  listenForMessage(isFirstTime){
    let ft=isFirstTime;
    this.auth.getUser().then(res=>{
      this.currentUser=res;
      this.rdb.list('/messages/'+this.currentUser).valueChanges().subscribe(message =>{
        console.log('/messages/'+this.currentUser);
        console.log(message.length);
        if(message.length>0){
        console.log("ListenForMessage():"+message[message.length-1]);
        this.incomemsg=JSON.parse(JSON.stringify(message[message.length-1]));
        this.msg={
          to:this.currentUser, //current user
          from:this.incomemsg.from,
          message:this.incomemsg.message,
          createdAt:this.incomemsg.createdAt
        }
        if(ft!=true){
          console.log(this.msg.from!=this.chattingUser);
          console.log(this.chattingUser);
          console.log("Alınan Mesaj:"+this.msg.message);
          this.sqliteService.addMessage(this.msg);
          this.add.next(this.msg);
          if(this.isNotification && this.msg.from!=this.chattingUser){
            this.notificationService.createNotification(this.msg.from,this.msg.message);

          }
        }
      }
      ft=false;
      
      },error=>{console.log(error)}
      );
    })
   }

   getAdd():BehaviorSubject<message>{
     return this.add;
   }
  

  


}

