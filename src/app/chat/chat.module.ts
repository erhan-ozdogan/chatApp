import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { MainPageModule } from "./main/main.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MainPageModule
  ]
})
export class ChatModule { }
