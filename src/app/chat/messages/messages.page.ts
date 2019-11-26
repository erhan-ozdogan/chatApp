import { Component, OnInit, ViewChild } from '@angular/core';
import { AutosizeModule } from "ngx-autosize";
import { IonContent } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  messages=[
    {
      user:'simon',
      createdAt:1554090856000,
      msg:'Hey whats up mate?'
    },
    {
      user:'max',
      createdAt:1554090956000,
      msg:'Working on the Ionic mission you?'
    },
    {
      user:'simon',
      createdAt:1554091056000,
      msg:'Doing Some tutorial stuff'
    }
  ];

  currentUser="simon";
  newMessage='';
  @ViewChild(IonContent,null) content: IonContent;

  constructor(private keyboard:Keyboard) { 
  }

  ngOnInit() {
    window.addEventListener('keyboardWillShow', (event) => {
      this.content.scrollToBottom(200);
  });
  }

  sendMessage(){
    this.messages.push({
      user:'simon',
      createdAt: new Date().getTime(),
      msg:this.newMessage
    });
    this.newMessage='';
    setTimeout(()=>{
      this.content.scrollToBottom(200);
    });
    
    
  }

}
