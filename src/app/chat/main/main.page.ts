import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../../services/notificationService/notification.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private notificationService:NotificationService) { }

  ngOnInit() {
  }
  getNotify(){
  this.notificationService.createNotification();

  }
}
