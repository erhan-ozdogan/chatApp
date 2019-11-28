import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from "../../services/authentication/authentication.service";
import {Storage} from '@ionic/storage';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  constructor(private storage:Storage,private auth:AuthenticationService,private router:Router){}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("merhaba");
      this.auth.isRegister().then(res =>{
        console.log(res);
        if(res=='true'){
          console.log(res);
          this.router.navigate(['chat/main']);
          return false;
        }
      });
      return true;

    }
  
}
