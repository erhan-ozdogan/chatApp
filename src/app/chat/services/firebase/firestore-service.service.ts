import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Contact } from '@ionic-native/contacts/ngx';
import { Observable } from 'rxjs';

import {AuthenticationService  } from "../authentication/authentication.service";
import {ContactServiceService} from '../contactService/contact-service.service'
import { LoggerService } from "../logger/logger.service";
import * as firebase from 'firebase';


export interface user{
  name:string,
  surname:string,
  username:string,
  password:string,
  phone:string
}

@Injectable({
  providedIn: 'root'
})


export class FirestoreServiceService {

    contactsFound:Contact[]=[];
   userCollection:AngularFirestoreCollection<user>;
   users:Observable<user[]>;
   appContacts:Contact[]=[];
  constructor(private db: AngularFirestore,private contacts:ContactServiceService,private logger:LoggerService ) { 
    this.userCollection = db.collection<user>('afadApp');
    this.users=this.userCollection.valueChanges();

  }
  addUser(phone_number){
    this.logger.log("Kullanıcı Firestore'a Eklendi");
   let x= this.userCollection.doc(phone_number).set({phone:phone_number});
   return x;
  }
  checkUser(){
    this.contactsFound.forEach(contact => {
      this.userCollection.doc(contact.phoneNumbers[0].value).get().subscribe(docSnapshot =>{
          if(docSnapshot.exists){
            this.appContacts.push(contact);
          }
      })
    });
    return this.appContacts;

  }
   getUser():Promise<any>{
    this.logger.log("Uygulamayı Kullanan Kişiler Alınıyor");
    this.appContacts=[];
     return this.contacts.getContacts().then((contacts:Contact[]) =>{
      this.contactsFound=contacts;
      this.contactsFound.forEach(contact => {
        contact.phoneNumbers[0].value=this.formatPhone(contact.phoneNumbers[0].value);
        this.userCollection.doc(contact.phoneNumbers[0].value).get().subscribe(docSnapshot =>{
            if(docSnapshot.exists){
              this.appContacts.push(contact);
            }
        })
      });
      console.log("Kişiler Alındı.");

    })
  }
  formatPhone(number:String){
    if(!number.startsWith('+')){
      number='+9'+number;
    }
    return number.replace(/\s/g, '');
  }




  
}
