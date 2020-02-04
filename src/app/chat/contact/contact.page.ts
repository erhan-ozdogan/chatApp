import { Component, OnInit } from '@angular/core';
import { Contact } from '@ionic-native/contacts/ngx';
import { LoadingController } from '@ionic/angular';
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Subscription } from 'rxjs';

import { SQLService } from "../services/sql/sql.service";
import { RealtimedbService } from "../services/realtimeDB/realtimedb.service";
import { AuthenticationService } from "../services/authentication/authentication.service";
import {FirestoreServiceService} from '../services/firebase/firestore-service.service';
import { ContactServiceService } from "../services/contactService/contact-service.service";
import { LoggerService } from "../services/logger/logger.service";











@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactsFound:Contact[]=[];
  appContacts:Contact[]=[];
  showing:number[]=[];
  devices:any[]=[];
  contactImages:any[]=[];
  loading:HTMLIonLoadingElement;
  lastOnlineTime;
  unSeenMessages;
  currentUser;
  db:Subscription;
  continue=false;
  clear=false;
  again=true;



  constructor(private contactService:ContactServiceService,
              private fs:FirestoreServiceService,
              private rdb:RealtimedbService,
              private loadingController:LoadingController,
              private auth:AuthenticationService,
              private plt:Platform,
              private sqlService:SQLService,
              private logger:LoggerService,
              ) {}

  ngOnInit() {  
    this.appContacts=[];
     this.fs.getUser().then(()=>{
       this.appContacts=this.fs.appContacts;
     }).then(()=>{
      this.auth.getLastOnlineTime().then(res =>{
        this.lastOnlineTime=res;
        this.logger.log("Son görülme:"+res);
        
      }).then(()=>{this.checkIsRegister()});
     })
      this.plt.pause.subscribe(()=>{
        this.auth.writeLastOnlineTime();
        this.logger.log("Platform Durduruldu");
        
      });
      this.plt.resume.subscribe(()=>{
        this.auth.removeLastOnlineTime();
        this.logger.log("Platform Devam Ettirildi");
      });
   
 

  
  }

  checkIsRegister(){
    this.plt.ready().then(()=>{
          this.auth.getUser().then(res=>{
            this.currentUser=res;
            this.logger.log("Giris Yapan Kullanıcı: "+res);
            this.rdb.listenForMessage(true);
            this.unSeenMessages=[];
            if(this.lastOnlineTime!=null){
              this.presentLoading()
              this.rdb.sync().once('value',res=>{
                this.logger.log("Alınan Mesajlar Senkronize ediliyor");
                res.forEach(message=>{
                  let x= message.val();
                  let msg={
                    to:this.currentUser, //current user
                    from:x.from,
                    message:x.message,
                    createdAt:x.createdAt
                  }
                  console.log(msg.message);
                  this.unSeenMessages.push(msg);
                });
                this.logger.log("Veritabanı Güncelleniyor");
                this.sqlService.syncDb(this.unSeenMessages,this.currentUser).then(()=>{
                  
                  this.logger.log("Veritabanı Güncellendi");
                })
                this.loading.dismiss();
                this.logger.log("Alınan Mesajlar Senkronize edildi");
               /* this.logger.log("Göderilen Mesajlar Senkronize ediliyor");
                console.log(this.appContacts.length);
                this.appContacts.forEach(contact => {
                  this.logger.log("Senkronize edilen kişi: "+contact.phoneNumbers[0].value);
                  this.rdb.syncTwo(contact.phoneNumbers[0].value).orderByChild('from').equalTo(this.currentUser).once('value',res=>{
                    res.forEach(message=>{
                      let x= message.val();
                      let msg={
                        to:contact.phoneNumbers[0].value,
                        from:this.currentUser,
                        message:x.message,
                        createdAt:x.createdAt
                      }
                      this.logger.log("Gönderilen Mesajlar Senkronize Edildi");
                      this.unSeenMessages.push(msg);
                    });
                  }).then(()=>{
                    this.logger.log("Veritabanı Güncelleniyor");
                    this.sqlService.syncDb(this.unSeenMessages,this.currentUser).then(()=>{
                      
                      this.logger.log("Veritabanı Güncellendi");
                    })
                  })
                });*/
              })
            }
          })
    });
  }
  clear_note(phone){
    this.appContacts.find(x=> x.phoneNumbers[0].value==phone).note="false";
  }
  revealNumber(contactId:number){
    this.logger.log("Kişi Numarası Gösterildi");
      let element=this.showing.indexOf(contactId);
    if(element==-1)
      this.showing.push(contactId);
    else if(element>-1)
      this.showing.splice(element,1);

  }
  ionViewWillLeave(){
    this.logger.log("Son görülme Silindi.");
    this.auth.removeLastOnlineTime();
  }

  loadContact(){
    this.logger.log("Rehberden Kişiler Alınıyor");
    if(this.contactsFound.length>0){
      this.contactsFound=[];
    this.logger.log("Kişi Bulunamadı");
    }
    else{
      this.contactService.getContacts().then((contacts: Contact[]) =>{
        this.contactsFound=contacts;
        this.logger.log("Kişiler Alındı");
      });
    }
  }
  loadAppContact(){
    this.logger.log("Uygulamayı Kullanan Kişiler Alınıyor");
    return this.fs.getUser()
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Mesajlar Senkronize Ediliyor.',
    });
    await this.loading.present();
  }
  

  
}
