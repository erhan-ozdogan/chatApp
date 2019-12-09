import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";

import { RealtimedbService } from "../services/realtimeDB/realtimedb.service";
import { AuthenticationService } from "../services/authentication/authentication.service";



@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit { 

  constructor(private rdb:RealtimedbService,
              private auth:AuthenticationService,
              private router:Router,
              private plt:Platform,
              ) {
    
   }

  ngOnInit() {
      this.plt.ready().then(()=>{
      this.auth.isRegister().then(res =>{
        console.log("Kullanıcı Girisi:"+res);
        if(!res){
          this.goto();
        }else{
          this.rdb.listenForMessage(true);
        }


      });
    });


  }
  goto(){
    this.router.navigate(['chat/login']);
  }
}
