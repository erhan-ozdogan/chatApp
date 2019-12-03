import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',  redirectTo:'contact', pathMatch:'full' },
  { path: 'main', loadChildren: './main/main.module#MainPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'messages/:to', loadChildren: './messages/messages.module#MessagesPageModule' },
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
