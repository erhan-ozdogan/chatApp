import { Component, OnInit, ViewChild } from '@angular/core';
import { AutosizeModule } from "ngx-autosize";
import { IonContent } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { RealtimedbService } from "../../services/realtimeDB/realtimedb.service";
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute  } from '@angular/router';



@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  messages=[];
  to;
  currentUser="+905389640431"; //Değiştir.
  newMessage='';
  @ViewChild(IonContent,null) content: IonContent;

  constructor(private keyboard:Keyboard,private rdb:RealtimedbService,private route:ActivatedRoute) { 
    this.to=this.route.snapshot.paramMap.get('to');
    console.log("Kime",this.to); 
  }
  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
  }

  ngOnInit() {
    window.addEventListener('keyboardWillShow', (event) => {
      this.content.scrollToBottom(200);
  });
  }

  sendMessage(){
    this.rdb.sendMessage(this.to,this.currentUser,this.newMessage).then(()=>{
      this.messages.push({
        user:'simon',
        createdAt: new Date().getTime(),
        msg:this.newMessage
      });
      this.newMessage='';
      setTimeout(()=>{
        this.content.scrollToBottom(200);
      });
    }) 
  }

}
