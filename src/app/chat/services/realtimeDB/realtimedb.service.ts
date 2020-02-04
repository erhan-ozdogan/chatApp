import { Injectable,NgZone } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject, ReplaySubject} from 'rxjs';

import { NotificationService } from "../notificationService/notification.service";
import { AuthenticationService } from "../authentication/authentication.service";
import { SQLService,message } from '../sql/sql.service';
import { LoggerService } from "../logger/logger.service";


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
  x:any;
  y:any;
  z:any;
  msg:message={
    to:'',
    from:'',
    createdAt:0,
    message:''
  }
  incomemsg:fbmsg;
  currentUser;
  add=new BehaviorSubject<message>(null);
  removed=new BehaviorSubject<message>(null);
  updated=new BehaviorSubject<message>(null);
  isNotification=true;
  chattingUser;

  constructor(public rdb: AngularFireDatabase,
              private zone:NgZone,
              private auth:AuthenticationService,
              private logger:LoggerService,
              private sqlService:SQLService) { 
    this.auth.getUser().then(res =>{this.currentUser=res;});
  }

  sendMessage(to:String,from:String,message:String,createdAt:number){
    let url='/messages/'+to;
    return this.rdb.list(url).push({
      from:from,
      message:message,
      createdAt:createdAt
    })
  }
  listenForMessage(isFirstTime){
    let ft=Date.now();
    this.logger.log("Veriler şundan itibaren alınacak: "+ft);
    this.auth.getUser().then(res=>{
      this.currentUser=res;
      if(this.x!=null)
      this.x.unsubscribe();
      this.x=this.rdb.database.ref('/messages/'+this.currentUser).orderByChild('createdAt').startAt(ft).on('child_added',(snapshot)=>{
        let message=snapshot.val();
        this.incomemsg=JSON.parse(JSON.stringify(message));
        this.msg={
          to:this.currentUser, //current user
          from:this.incomemsg.from,
          message:this.incomemsg.message,
          createdAt:this.incomemsg.createdAt
        }
        this.logger.log("Alınan Mesaj:"+this.msg.message);
        this.sqlService.addMessage(this.msg);  
        this.zone.run(()=>{
          if(this.msg.from==this.chattingUser){
            this.add.next(this.msg);
          }
        })
        
      });

      if(this.y!=null)
      this.y.unsubscribe();
      this.y=this.rdb.database.ref('/messages/'+this.currentUser).on('child_removed',(snapshot)=>{
        let message=snapshot.val();
        this.incomemsg=JSON.parse(JSON.stringify(message));
        this.msg={
          to:this.currentUser, //current user
          from:this.incomemsg.from,
          message:this.incomemsg.message,
          createdAt:this.incomemsg.createdAt
        }
        this.logger.log("Silinen Mesaj:"+this.msg.message);
        this.sqlService.removeMessage(this.msg);  
        this.zone.run(()=>{
          if(this.msg.from==this.chattingUser){
            this.removed.next(this.msg);  
          }
        })
      });
      if(this.z!=null)
      this.z.unsubscribe();
      this.z=this.rdb.database.ref('/messages/'+this.currentUser).on('child_changed',(snapshot)=>{
        let message=snapshot.val();
        this.incomemsg=JSON.parse(JSON.stringify(message));
        this.msg={
          to:this.currentUser, //current user
          from:this.incomemsg.from,
          message:this.incomemsg.message,
          createdAt:this.incomemsg.createdAt
        }
        this.logger.log("Güncellenen Mesaj:"+this.msg.message);
        this.sqlService.updateMessage(this.msg);  
        this.zone.run(()=>{
          if(this.msg.from==this.chattingUser){
            this.updated.next(this.msg);
          }
        })
      })



   })
   
  }
   //----------------------------------------------------------------------------------------------
   //----------------------------------------------------------------------------------------------

   getOfflineMessages(time){
      return this.rdb.list("/messages/"+this.currentUser,ref=> ref.orderByChild('createdAt').startAt(time)).valueChanges();
   }

   getAdd():BehaviorSubject<message>{
     return this.add;
   }
   getRemoved():BehaviorSubject<message>{
     return this.removed;
   }
   getUpdated():BehaviorSubject<message>{
    return this.updated;
  }
   removeMessage(message:message){
     let x;
     this.rdb.database.ref("/messages/"+message.to).orderByChild('createdAt').equalTo(message.createdAt).once('value').then(res=>{
     res.forEach(childsnap=>{
        x=childsnap.key;
      });
      this.rdb.database.ref("/messages/"+message.to+"/"+x).remove().then(x=>{
        this.sqlService.removeMessage(message);
        this.logger.log("Mesaj Silindi");
      })
     });
   }
   updateMessage(message,msg){
    let x;
    return this.rdb.database.ref("/messages/"+message.to).orderByChild('createdAt').equalTo(message.createdAt).once('value').then(res=>{
    res.forEach(childsnap=>{
       x=childsnap.key;
     });
     this.rdb.database.ref("/messages/"+message.to+"/"+x).update({message:msg}).then(x=>{
       this.sqlService.updateMessage(message,msg);
       this.logger.log("Mesaj Güncellendi");
     })
    });

   }

   sync(){
     return this.rdb.database.ref("/messages/"+this.currentUser);
   }
   syncTwo(contact){
    return this.rdb.database.ref("/messages/"+contact);
   }
  

  


}

