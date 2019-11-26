import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo:'main', pathMatch:'full' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'messages', loadChildren: './messages/messages.module#MessagesPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
];

@NgModule({
  declarations: [],
  imports: [  
    RouterModule.forChild(routes)
    
  ],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
