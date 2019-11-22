import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ChatModule } from "./chat/chat.module";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Contacts } from "@ionic-native/contacts/ngx";
import { AngularFireModule } from "angularfire2";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,ChatModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Contacts
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
