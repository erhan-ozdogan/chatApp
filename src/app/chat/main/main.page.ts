import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../../services/notificationService/notification.service";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit { 

  constructor(private notificationService:NotificationService,private auth:AuthenticationService,private router:Router,private plt:Platform) {
    
   }

  ngOnInit() {
      this.plt.ready().then(()=>{
      this.auth.isRegister().then(res =>{
        console.log(res);
        if(!res){
          this.goto();
        }

      });
    });


  }
  goto(){
    this.router.navigate(['chat/login']);
  }


  getNotify(){
  this.notificationService.createNotification();
  }
}
