import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { MainPageModule } from "./main/main.module";
import { ContactPageModule } from "./contact/contact.module";
import { MessagesPageModule } from "./messages/messages.module";
import { Contacts } from "@ionic-native/contacts/ngx";
import { AutosizeModule } from 'ngx-autosize';
import { AngularFireModule } from "angularfire2";
import { Keyboard } from '@ionic-native/keyboard/ngx';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MainPageModule,
    AutosizeModule,
    ContactPageModule,
    MessagesPageModule,
    AutosizeModule

  ],
  providers: [
    Contacts,
    Keyboard
  ],
})
export class ChatModule { }
