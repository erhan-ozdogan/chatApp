import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppguardGuard } from "../services/appguard/appguard.guard";

const routes: Routes = [
  { path: '',  redirectTo:'contact', pathMatch:'full' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule',canActivate:[AppguardGuard]},
  { path: 'messages/:to', loadChildren: './messages/messages.module#MessagesPageModule',canActivate:[AppguardGuard] },
];

@NgModule({
  declarations: [],
  imports: [  
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
