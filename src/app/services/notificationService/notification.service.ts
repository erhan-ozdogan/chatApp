import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notification:LocalNotifications) { }

  createNotification(from,message){
    this.notification.schedule({
      id:1,
      title:from,
      text:message,

    });
    console.log("Created");
  }
}
