import { Injectable,NgZone } from '@angular/core';
import { BluetoothLE,BluetoothCallbackType } from "@ionic-native/bluetooth-le/ngx";
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  devices:any[]=[];
  constructor(private bluetoothle:BluetoothLE,
              private plt:Platform,
              private alertController:AlertController,
              private zone:NgZone) {

    this.plt.ready().then(()=>{
      this.bluetoothle.enable(); //sil
      this.bluetoothle.initialize().subscribe(ble =>{
        console.log("Bluetooth Status:",ble.status);
      
        /*if(ble.status=="disabled"){
          this.presentAlertConfirm();
        }*/
      })
    })
   }

   async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'BT Confirm !',
      message: 'Bluetooth Etkinleştirilsin mi?',
      buttons: [
        {
          text: 'İzin Ver',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log("İzin Ver");
            this.bluetoothle.enable();
            console.log("Acildi");
          }
        }, {
          text: 'Reddet',
          handler: () => {
            console.log('Reddet');
          }
        }
      ]
    });

    await alert.present();
  }

 scan(){
   this.devices=[];
    setTimeout(()=>{this.bluetoothle.stopScan(); console.log("Tarama Tamamlandı")},20000);
    this.bluetoothle.startScan({services:[]}).subscribe((success) =>{
      this.zone.run(()=>{
        this.devices.push(success)
        console.log("Cihaz Adı: ",success.name,"Cihaz Adresi: ",success.address,"Rssi: ",success.rssi);
      })
      
     
   });
  }

}

