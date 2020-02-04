import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ToastController } from '@ionic/angular';
import { AuthService } from "./services/auth/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Chat',
      url: '/chat',
      icon: 'chatbubbles'
    },
    {
      title: 'Logout',
      url: '/login',
      icon: 'log-out'
    }
  ];
  login=false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toastController: ToastController,
    private auth:AuthService,
  ) {
    this.initializeApp();
    this.auth.registerAuth.asObservable().subscribe(res=>{
      console.log(res);
      if(res==true)
      this.login=true;
      else
      this.login=false;
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  logout(){
    console.log("Çıkıldı");
    this.auth.logout();
    this.presentToast("Çıkış Yapıldı");

  }
  async presentToast(yazi) {
    const toast = await this.toastController.create({
      message:yazi,
      duration: 2000
    });
    toast.present();
  }
}
