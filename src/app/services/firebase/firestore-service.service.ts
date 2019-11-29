import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { AngularFireDatabase } from "@angular/fire/database";
import {ContactServiceService} from '../../services/contactService/contact-service.service'
import {user} from '../SQLite/sqlite.service'
import { Contacts, Contact,ContactFieldType } from '@ionic-native/contacts/ngx';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreServiceService {
    contactsFound:Contact[]=[];
   userCollection:AngularFirestoreCollection<user>;
   users:Observable<user[]>;
   appContacts:Contact[]=[];
  constructor(private db: AngularFirestore,private contacts:ContactServiceService,private rdb:AngularFireDatabase ) { 
    this.userCollection = db.collection<user>('afadApp');
    this.users=this.userCollection.valueChanges();

  }
  addUser(user:user){
   this.userCollection.doc(user.phone).get().subscribe(result=>{
     console.log(result.exists);
   })
   let x= this.userCollection.doc(user.phone).set(user);
   return x;
  }
  checkUser(){
    //kişi listesinden telefon numaralarını al firebaseden alınan kişilerle kontolet eşleşenleri döndür
   // this.getUser();
    console.log("checkUser");
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
    console.log("Kullanıcılar Alınıyor");
    this.contacts.getContacts().then((contacts:Contact[]) =>{
      this.contactsFound=contacts;
      this.contactsFound.forEach(contact => {
        contact.phoneNumbers[0].value=this.formatPhone(contact.phoneNumbers[0].value);
        console.log(contact.phoneNumbers[0].value);
        this.userCollection.doc(contact.phoneNumbers[0].value).get().subscribe(docSnapshot =>{
            if(docSnapshot.exists){
              this.appContacts.push(contact);
            }
        })
      });
    })
    console.log("Kullanıcılar Alındı");
    return this.appContacts;
  }
  formatPhone(number:String){
    if(!number.startsWith('+')){
      number='+9'+number;
    }
    return number.replace(/\s/g, '');
  }
}
