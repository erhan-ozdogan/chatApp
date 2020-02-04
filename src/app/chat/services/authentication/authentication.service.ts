import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LoggerService } from "../logger/logger.service";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  registerAuth= new BehaviorSubject(false);
  user:any;
  

  constructor(private storage:Storage,private plt:Platform,private logger: LoggerService) {
    this.plt.ready().then(() => {
      this.checkIsRegister();
    });
  }
  checkIsRegister(){
    this.storage.get("register").then(res =>{
      if(res){
        this.registerAuth.next(true);
      }
    });
  }
  isRegister(){
    return this.storage.get("register");
  }
  writeLastOnlineTime(){
    let x=new Date().getTime()
    this.storage.set("time",x).then(()=>{
      this.logger.log("Son Görülme => "+x )
    })
  }
  removeLastOnlineTime(){
    this.storage.remove("time").then(()=>{
      this.logger.log("Son Görülme Silindi")
    });
  }
  getLastOnlineTime(){
    return this.storage.get("time");
  }
  getUser(){
    return this.storage.get("user");
  }

}
