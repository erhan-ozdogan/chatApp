import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { LoggerService } from "../../chat/services/logger/logger.service";

@Injectable({
  providedIn: 'root'
})
export class AppguardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private logger:LoggerService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.authService.isRegister().then(res=>{
        if(!res){
          this.logger.log("Giriş Yapılmadı Login Sayfasına Yönlendiriliyor");
          this.router.navigate(['/login']);
          return false;
        }
      })
      this.logger.log("Giriş Yapılmış");
    return true;
  }
  
}
