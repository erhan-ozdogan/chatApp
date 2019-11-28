import { Component, OnInit } from '@angular/core';
import { ContactServiceService } from "../../services/contactService/contact-service.service";
import { Contacts, Contact,ContactFieldType } from '@ionic-native/contacts/ngx';
import { SQLiteService,user } from "../../services/SQLite/sqlite.service";
import { Platform } from "@ionic/angular";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { Router } from "@angular/router";
import {BluetoothService} from '../../services/bluetooth/bluetooth.service'
import { BleService } from "../../services/BLE/ble.service";
import {FirestoreServiceService} from '../../services/firebase/firestore-service.service';




@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactsFound:Contact[]=[];
  appContacts:Contact[]=[];
  showing:number[]=[];
  users:user[]=[];
  devices:any[]=[];

  constructor(private contactService:ContactServiceService,
              private sqliteService:SQLiteService,
              private plt:Platform,
              private bluetoothService:BluetoothService,
              private ble:BleService,
              private fs:FirestoreServiceService) { }

  ngOnInit() {   

    this.loadContact();
    /*this.sqliteService.getDatabaseState().subscribe(ready => {
      if(ready){
        console.log("Alindi");
        this.sqliteService.getUsers().subscribe(users =>{
          this.users=users;
        })
      }
    })*/

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
    this.contactService.getContacts().then((contacts: Contact[]) =>{
      this.contactsFound=contacts;
    });
  }
  loadAppContact(){
    console.log("loadAppContact");
    this.appContacts=this.fs.checkUser();
  }
  
}
