import { Component, OnInit, ViewChild } from '@angular/core';
import { AutosizeModule } from "ngx-autosize";
import { IonContent } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { RealtimedbService } from "../../services/realtimeDB/realtimedb.service";
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute  } from '@angular/router';
import { SQLiteService,message } from "../../services/SQLite/sqlite.service";
import { AuthenticationService } from "../../services/authentication/authentication.service";




@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  //messages=[];
  messages:message[]=[];
  to;
  from="+905389640431"; //Değiştir. current user
  newMessage='';
  @ViewChild(IonContent,null) content: IonContent;

  constructor(private keyboard:Keyboard,
              private rdb:RealtimedbService,
              private route:ActivatedRoute,
              private sqliteService:SQLiteService,
              private auth:AuthenticationService) { 

    this.to=this.route.snapshot.paramMap.get('to');
    console.log("Mesaj Sayfası:"+this.to); 
  }

  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
  }

  ngOnInit() {
    this.auth.getUser().then(res=>{
      this.from=res;this.loadMessages()
      this.rdb.isNotification=false;
      this.rdb.chattingUser=this.to;
      this.rdb.getAdd().subscribe(res=>{
        this.messages.push(res);
        this.content.scrollToBottom(1000);
      });
    })
    window.addEventListener('keyboardWillShow', (event) => {
      this.content.scrollToBottom(400);
  });

  }
  ionViewDidLeave(){
    console.log("Erhan");
    this.rdb.isNotification=true;
    this.rdb.chattingUser="null";

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
        })
        console.log("loadMessages():Mesajlar Alindi");
      }
    })
  }

}
