import { Component, OnInit, ViewChild,NgZone } from '@angular/core';
import { IonContent,Platform } from '@ionic/angular';
import {  ActivatedRouteSnapshot, ActivatedRoute  } from '@angular/router';

import { SQLService,message } from "../services/sql/sql.service";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { FirestoreServiceService } from "../services/firebase/firestore-service.service";
import { RealtimedbService } from "../services/realtimeDB/realtimedb.service";

import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { LoggerService } from "../services/logger/logger.service";







@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  messages:message[]=[];
  to;
  from; //current user
  newMessage='';
  contactName;
  msgSub;
  removeSub;
  updateSub;
  deleteMessage:message;
  previuousMessage:message;
  messageClass;
  loader:HTMLIonLoadingElement;
  @ViewChild(IonContent,null) content: IonContent;

  constructor(
              private rdb:RealtimedbService,
              private route:ActivatedRoute,
              private auth:AuthenticationService,
              private firestroreDb:FirestoreServiceService,
              private sqlService:SQLService,
              private alertController:AlertController,
              private actionSheetController:ActionSheetController,
              private loadingController:LoadingController,
              private zone:NgZone,
              private platform:Platform,
              private logger: LoggerService ) { 
    this.to=this.route.snapshot.paramMap.get('to');
    this.logger.log("Mesaj Sayfası:"+this.to);
  }

  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
  }

  ngOnInit() {
    this.platform.ready().then(()=>{
    this.auth.writeLastOnlineTime();
    this.auth.getUser().then(res=>{
      this.from=res;
      this.loadMessages();
      this.rdb.isNotification=false;
      this.rdb.chattingUser=this.to;
      this.findToName();

      if(this.removeSub!=null)
      this.removeSub.unsubscribe();
      this.zone.run(()=>{
        this.removeSub=this.rdb.getRemoved().subscribe(res=>{
          this.logger.log("Silinen Mesajlar Takip Ediliyor");
          this.messages.splice(this.messages.findIndex(i=>i.createdAt === res.createdAt),1);
       });
      })
      this.zone.run(()=>{
        this.updateSub=this.rdb.getUpdated().subscribe(res=>{
          this.logger.log("Güncellenen Mesajlar Takip Ediliyor");
            let i=this.messages.findIndex(i=>i.createdAt === res.createdAt);
            this.messages[i].message=res.message;
       });
      })
      if(this.msgSub!=null)
      this.msgSub.unsubscribe();
      this.zone.run(()=>{
        this.msgSub=this.rdb.getAdd().subscribe(res=>{
          this.logger.log("Eklenen Mesajlar Takip Ediliyor");
          this.messages.push(res);
          setTimeout(()=>{this.content.scrollToBottom(200),300});
        });
      })

    });

    window.addEventListener('keyboardWillShow', (event) => {
      this.content.scrollToBottom(400);
  });

  
    })
  }

  ionViewDidLeave(){
    this.rdb.isNotification=true;
    this.rdb.chattingUser="null";
    this.msgSub.unsubscribe();

  }
  findToName(){
    let contacts=this.firestroreDb.contactsFound;
    this.contactName=contacts.find(x=>x.phoneNumbers[0].value==this.to).displayName;
  }



  sendMessage(){
    let createdAt=new Date().getTime();
    let msg={
      to:this.to,
      from:this.from,
      createdAt:createdAt,
      message:this.newMessage
    };
    this.rdb.sendMessage(this.to,this.from,this.newMessage,createdAt).then(()=>{
      this.messages.push(msg);
      this.logger.log("Mesaj Yollandı");
      this.sqlService.addMessage(msg);
      this.newMessage='';
      setTimeout(()=>{
        this.content.scrollToBottom(200);
      });
    }) 
  }
 
  

  loadMessages(){
    this.logger.log("Mesajlar Alınınyor");
    this.sqlService.getDatabaseState().subscribe(ready => {
      if(ready){
        this.sqlService.loadMessages(this.to,this.from);
        this.sqlService.getMessages().subscribe(messages =>{
          this.messages=messages;
          setTimeout(()=>{
            this.content.scrollToBottom(200);
          });
        })
        this.logger.log("Mesajlar Alindi");
      }
    })
  }
  selectForDel(message:message){
    if(this.deleteMessage==message){
      this.deleteMessage=null;
      this.messageClass=null;
      this.logger.log("Mesaj Düzenleme İptal edildi.");
    }
    else{
      this.logger.log("Mesaj Düzenleniyor");
      this.deleteMessage=message;
      this.messageClass=message.createdAt;
      this.presentActionSheet();
    }


  }

  remove(){
    this.deleteMessage=this.previuousMessage;
    this.logger.log("Mesaj Silindi");
    this.rdb.removeMessage(this.deleteMessage);
    this.messages.splice(this.messages.indexOf(this.deleteMessage),1);
    this.deleteMessage=null;
    this.previuousMessage=null;
  }

//-----------------------------------------------------------------------------

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Mesaj Sillinsin mi?',
      message: 'Silinen şey bi daha geri gelmez.',
      buttons: [
        {
          text:"Sil gitsin.",
          cssClass:'primary',
          handler:()=>{this.remove()}
        },
        {
          text:"Dur bidaha bakıyım",
          cssClass:'danger'
        },

      ]
    });
    await alert.present();
  }
//-----------------------------------------------------------------------------
async presentMessageEditAlert() {
  const alert = await this.alertController.create({
    header: 'Yeni Mesajı Girin',
    inputs:[{name:'newMessage',type:'text',placeholder:'Yeni Mesaj'}],
    buttons: [
      {
        text:"Yolla",
        cssClass:'primary',
        handler:(data)=>{
          let data1=data;
          this.presentLoading().then(()=>{
            this.zone.run(()=>{              
              this.deleteMessage=this.previuousMessage;
              this.rdb.updateMessage(this.deleteMessage,data1.newMessage).then(res=>{
                this.deleteMessage.message=data1.newMessage;
                this.previuousMessage=null;
                this.deleteMessage=null
                this.loader.dismiss();
              })
            })
          });
        }
      },
      {
        text:"Boşver",
        role:"cancel",
        cssClass:'danger'
      },
    ]
  });
  await alert.present();
}

//-----------------------------------------------------------------------------
async presentActionSheet() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Mesajı Düzenle',
    buttons: [{
      text: 'Sil',
      icon: 'trash',
      handler: () => {
        this.presentAlert();
      }
    },{
      text: 'Düzenle',
      icon: 'create',
      handler: () => {
        this.presentMessageEditAlert(); 
      }
    },{
      text: 'Kapat',
      icon: 'close',
      handler: () => {
        console.log('Kapat');
      }
    }]
  });
  await actionSheet.present();
  actionSheet.onDidDismiss().then(()=>{this.previuousMessage=this.deleteMessage;this.deleteMessage=null;this.messageClass=null;});
}

//-----------------------------------------------------------------------------
async presentLoading() {
  this.loader = await this.loadingController.create({
    message: 'Lütfen Bekle'
  });
  await this.loader.present();
}


  

}
