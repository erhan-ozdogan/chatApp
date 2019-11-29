import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardGuard } from "./guards/login-guard.guard";

const routes: Routes = [
  { path: '',  redirectTo:'main', pathMatch:'full' },
  { path: 'main', loadChildren: './main/main.module#MainPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'messages/:to', loadChildren: './messages/messages.module#MessagesPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'chats', loadChildren: './chats/chats.module#ChatsPageModule' },
];

@NgModule({
  declarations: [],
  imports: [  
    RouterModule.forChild(routes)
    
    
  ],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
