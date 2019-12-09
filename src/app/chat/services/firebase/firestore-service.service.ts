import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Contact } from '@ionic-native/contacts/ngx';
import { Observable } from 'rxjs';

import {AuthenticationService  } from "../authentication/authentication.service";
import {ContactServiceService} from '../contactService/contact-service.service'


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
  constructor(private db: AngularFirestore,private contacts:ContactServiceService,private auth:AuthenticationService ) { 
    this.userCollection = db.collection<user>('afadApp');
    this.users=this.userCollection.valueChanges();

  }
  addUser(user:user){
   let x= this.userCollection.doc(user.phone).set(user);
   return x;
  }
  checkUser(){
    //kişi listesinden telefon numaralarını al firebaseden alınan kişilerle kontolet eşleşenleri döndür
   // this.getUser();
    this.contactsFound.forEach(contact => {
      this.userCollection.doc(contact.phoneNumbers[0].value).get().subscribe(docSnapshot =>{
          if(docSnapshot.exists){
            this.appContacts.push(contact);
            //Burada Sıkıntı Var
          }
      })
    });
    return this.appContacts;

  }
  getUser(){
    this.appContacts=[];
    console.log("getUser():Kullanıcılar Alınıyor");
    this.contacts.getContacts().then((contacts:Contact[]) =>{
      this.contactsFound=contacts;
      this.contactsFound.forEach(contact => {
        contact.phoneNumbers[0].value=this.formatPhone(contact.phoneNumbers[0].value);
        this.userCollection.doc(contact.phoneNumbers[0].value).get().subscribe(docSnapshot =>{
            if(docSnapshot.exists){
              this.appContacts.push(contact);
            }
        })
      });
    })
    console.log("getUser():Kullanıcılar Alındı");
    return this.appContacts;
  }
  formatPhone(number:String){
    if(!number.startsWith('+')){
      number='+9'+number;
    }
    return number.replace(/\s/g, '');
  }
}
