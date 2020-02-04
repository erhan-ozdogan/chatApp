import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from "@ionic/angular";

import {AuthService} from '../services/auth/auth.service';
import {FirestoreServiceService} from '../chat/services/firebase/firestore-service.service';
import { WindowService } from "../services/window/window.service";
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { LoggerService } from "../chat/services/logger/logger.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit,AfterViewInit {

  user={username:"erhan11",
              name:"erhan",
              password:"123",
              surname:"ozdogan",
              phone:"1231321321"
              };
windowRef:any;
verificationCode:string;
registerForm:FormGroup;
part2=false;
recapt=false;
  constructor(private fb:FormBuilder,
              private router:Router,
              private fbService:FirestoreServiceService,
              private auth:AuthService,
              private plt:Platform,
              private win:WindowService,
              public toastController: ToastController,
              private logger:LoggerService) { 


  };
  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
  }

  ngOnInit() {

    

    this.registerForm =this.fb.group({
      phone: ['',Validators.required],
      verifyCode: ['',Validators.required],
    });
  }
  ngAfterViewInit(){
    this.windowRef=this.win.windowRef;
    this.windowRef.recaptchaVerifier=this.auth.getVerifier();
    this.windowRef.recaptchaVerifier.render();
    this.windowRef.recaptchaVerifier.verify().then(result=>{
      this.recapt=true;
      this.logger.log("Recaptcha Çözüldü");
      this.presentToast("Recaptcha Çözüldü");
    })
  }
  firebaseLogin(){
    
    const appVerifier=this.windowRef.recaptchaVerifier;
    if(!this.recapt)
      this.presentToast("reCAPTCHA Çözülmedi");
    firebase.auth().signInWithPhoneNumber(this.registerForm.value.phone,appVerifier)
            .then(result => {
                this.windowRef.confirmationResult = result;
                this.part2=true;
                this.recapt=false;
                this.logger.log("Firebase Mesajı Alındı");
            })
            .catch( error =>{ this.logger.log(error);this.presentToast("Bir Hata Meydana Geldi");this.recapt=false;} );
  }
  verifyLoginCode() {
    this.windowRef.confirmationResult.confirm(this.verificationCode).then( result => {
                    this.user = result.user;
                    this.fbService.addUser(this.registerForm.value.phone).then(res=>{
                      this.logger.log("Giriş Başarılı");
                      this.presentToast("Giriş Başarılı");
                      this.auth.writeLocal(this.registerForm.value.phone);
                      this.router.navigateByUrl('');
                    })
                    

    })
    .catch( error => this.logger.log(error));
  }
  async presentToast(yazi) {
    const toast = await this.toastController.create({
      message:yazi,
      duration: 2000
    });
    toast.present();
  }

}
