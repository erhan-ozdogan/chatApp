import { Injectable } from '@angular/core';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';
import { LoggerService } from "../logger/logger.service";


@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {
  constructor(private contacts:Contacts,private logger:LoggerService) { }

  getContacts(){
    this.logger.log("Contact Servisi: Kişiler Alınıyor");
    const options={
      filter: '',
      multiple: true,
      hasPhoneNumber:true
    };
    return this.contacts.find(['*'],options);
  }


}
