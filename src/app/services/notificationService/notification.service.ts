import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notification:LocalNotifications) { }

  createNotification(){
    this.notification.schedule({
      id:1,
      title:"This is a Created Notification",
      text:"Hemen geliyorum",

    });
    console.log("Created");
  }
}
