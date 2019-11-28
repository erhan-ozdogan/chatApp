import { Injectable,NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx'
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class BleService {
devices:any[]=[];
devices2:BehaviorSubject<any[]>;
  constructor(private ble:BLE,private zone:NgZone) {

   }

   scan(){
     console.log("Scan");
     this.devices=[];
       this.ble.scan([],30).subscribe(
         device=>this.onDeviceDiscovered(device)
       );
     }
     onDeviceDiscovered(device){
       console.log("Discovered"+JSON.stringify(device,null,2));
       this.zone.run(()=>{
        this.devices.push(device);
        console.log(device);
        this.devices2.next(device);
      })
     }
   
}
