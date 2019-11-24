import { Component, OnInit } from '@angular/core';
import { ContactServiceService } from "../../services/contactService/contact-service.service";
import { Contacts, Contact,ContactFieldType } from '@ionic-native/contacts/ngx';
import { SQLiteService,user } from "../../services/SQLite/sqlite.service";
import { Platform } from "@ionic/angular";




@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactsFound:Contact[]=[];
  showing:number[]=[];
  users:user[]=[];

  constructor(private contactService:ContactServiceService,private contacts:Contacts,private sqliteService:SQLiteService) { }

  ngOnInit() {    
    this.loadContact();
    this.sqliteService.getDatabaseState().subscribe(ready => {
      if(ready){
        console.log("Alindi");
        this.sqliteService.getUsers().subscribe(users =>{
          this.users=users;
        })
      }
    })

  }
  revealNumber(contactId:number){
    console.log(contactId);
      let element=this.showing.indexOf(contactId);
    if(element==-1)
      this.showing.push(contactId);
    else if(element>-1)
      this.showing.splice(element,1);
  }

  goToChat(){
    console.log("Kullanıcı ile Chat kısmına geçecek UUID yi parametre olarak alabilir.")

  }
  loadContact(){
    this.contactService.getContacts().then((contacts: Contact[]) =>{
      this.contactsFound=contacts;
    });
  }
  
}
