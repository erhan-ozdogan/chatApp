import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { RealtimedbService } from "../../services/realtimeDB/realtimedb.service";
import {  ActivatedRouteSnapshot, ActivatedRoute  } from '@angular/router';
import { SQLiteService,message } from "../../services/SQLite/sqlite.service";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { FirestoreServiceService } from "../../services/firebase/firestore-service.service";
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  messages:message[]=[];
  to;
  from; //current user
  newMessage='';
  contactName;
  msgSub;
  @ViewChild(IonContent,null) content: IonContent;

  constructor(
              private rdb:RealtimedbService,
              private route:ActivatedRoute,
              private sqliteService:SQLiteService,
              private auth:AuthenticationService,
              private firestroreDb:FirestoreServiceService) { 

    this.to=this.route.snapshot.paramMap.get('to');
    console.log("Mesaj Sayfası:"+this.to); 
  }

  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
  }

  ngOnInit() {
   
    this.auth.getUser().then(res=>{
      this.from=res;
      this.loadMessages();
      this.rdb.isNotification=false;
      this.rdb.chattingUser=this.to;
      this.findToName();
      this.msgSub=this.rdb.getAdd().subscribe(res=>{
        this.messages.push(res);
        setTimeout(()=>{this.content.scrollToBottom(200),300});
      });
    
    })
    window.addEventListener('keyboardWillShow', (event) => {
      this.content.scrollToBottom(400);
  });

  

  }
  ionViewDidLeave(){
    this.rdb.isNotification=true;
    this.rdb.chattingUser="null";
    this.msgSub.unsubscribe();

  }
  findToName(){
    let contacts=this.firestroreDb.contactsFound;
    this.contactName=contacts.find(x=>x.phoneNumbers[0].value==this.to).displayName;
  }



  sendMessage(){
    let createdAt=new Date().getTime();
    let msg={
      to:this.to,
      from:this.from,
      createdAt:createdAt,
      message:this.newMessage
    };
    this.rdb.sendMessage(this.to,this.from,this.newMessage,createdAt).then(()=>{
      this.messages.push(msg);
      this.sqliteService.addMessage(msg);
      this.newMessage='';
      setTimeout(()=>{
        this.content.scrollToBottom(200);
      });
    }) 
  }
 
  

  loadMessages(){
    this.sqliteService.getDatabaseState().subscribe(ready => {
      if(ready){
        this.sqliteService.loadMessages(this.to,this.from);
        this.sqliteService.getMessages().subscribe(messages =>{
          this.messages=messages;
          setTimeout(()=>{
            this.content.scrollToBottom(200);
          });
        })
        console.log("loadMessages():Mesajlar Alindi");
      }
    })
  }

}
