import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';
import { LoggerService } from "../../chat/services/logger/logger.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  registerAuth= new BehaviorSubject(false);
  verificationCode:string;
  user:any;
  windowRef;

  constructor(private storage:Storage,private plt:Platform,private logger:LoggerService) {
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
      this.logger.log("Storage'a Yazıldı");
    })
    this.storage.set("user",user);
  }
  getVerifier(){
    return new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }
  logout(){
    this.storage.remove("register").then(res=>{
      this.storage.remove("user").then(res2=>{
        if(res2)
        this.logger.log("Çıkış Yapıldı.");
      })
    })
  }
}
