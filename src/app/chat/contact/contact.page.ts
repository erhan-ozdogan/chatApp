import { Component, OnInit } from '@angular/core';
import { ContactServiceService } from "../../services/contactService/contact-service.service";
import { Contacts, Contact,ContactFieldType } from '@ionic-native/contacts/ngx';
import { Platform } from "@ionic/angular";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { Router } from "@angular/router";
import {BluetoothService} from '../../services/bluetooth/bluetooth.service'
import { BleService } from "../../services/BLE/ble.service";
import {FirestoreServiceService} from '../../services/firebase/firestore-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';






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
  loading;


  constructor(private contactService:ContactServiceService,
              private ble:BleService,
              private fs:FirestoreServiceService,
              private sanitizer:DomSanitizer,
              private loadingController:LoadingController) { }

  ngOnInit() {   
    this.loadAppContact();
  }

  revealNumber(contactId:number){
    console.log(contactId);
      let element=this.showing.indexOf(contactId);
    if(element==-1)
      this.showing.push(contactId);
    else if(element>-1)
      this.showing.splice(element,1);

  }
  getDevices(){
    this.ble.scan();
    this.devices=this.ble.devices;
  }

  goToChat(){
    console.log("Kullanıcı ile Chat kısmına geçecek UUID yi parametre olarak alabilir.")

  }
  loadContact(){
    if(this.contactsFound.length>0){
      this.contactsFound=[];
    }
    else{
      this.contactService.getContacts().then((contacts: Contact[]) =>{
        this.contactsFound=contacts;
      });
    }
  }
  loadAppContact(){
    this.presentLoading();
    console.log("loadAppContact");
    this.appContacts=this.fs.getUser();

  }

  async presentLoading() {
    this.loading= await this.loadingController.create({
      message: 'Lütfen Bekleyin',
    }).then(res =>{
      res.present();
      setTimeout(() => {
        res.dismiss();
      }, 2000);
    })
  }

  
}
