import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import {CanActivate} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  registerAuth= new BehaviorSubject(false);

  constructor(private storage:Storage,private plt:Platform) {
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
  writeLocal(user:string){
    this.storage.set("register","true").then(()=>{
      this.registerAuth.next(true);
      console.log("writeLocal():Locale Yazıldı");
    })
    this.storage.set("user",user)
  }
  writeLastOnlineTime(){
    let x=new Date().getTime()
    this.storage.set("time",x).then(()=>{console.log("Son Görülme => "+x )})
  }
  removeLastOnlineTime(){
    this.storage.remove("time").then(()=>{console.log("Son Görülme Silindi")});
  }
  getLastOnlineTime(){
    return this.storage.get("time");
  }
  getUser(){
    return this.storage.get("user");
  }
}
