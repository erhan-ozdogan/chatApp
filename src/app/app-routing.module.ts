import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppguardGuard } from "./services/appguard/appguard.guard"

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate:[AppguardGuard]
  },
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule',
    canActivate:[AppguardGuard]
  },
  { path: 'login',
    loadChildren: './login/login.module#LoginPageModule',
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
