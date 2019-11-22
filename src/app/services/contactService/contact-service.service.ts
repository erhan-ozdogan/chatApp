import { Injectable } from '@angular/core';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';


@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {
  constructor(private contacts:Contacts) { }

  getContacts(){
    const options={
      filter: '',
      multiple: true,
      hasPhoneNumber:true
    };
    return this.contacts.find(['*'],options);
  }


}
