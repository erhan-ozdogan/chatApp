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
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import {HttpClientModule } from '@angular/common/http'




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MainPageModule,
    AutosizeModule,
    ContactPageModule,
    MessagesPageModule,
    AutosizeModule,
    HttpClientModule,

  ],
  providers: [
    Contacts,
    Keyboard,
    LocalNotifications,
    SQLite,
    SQLitePorter,
  ],
})
export class ChatModule { }