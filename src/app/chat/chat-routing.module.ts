import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo:'main', pathMatch:'full' },
  { path: 'main2', loadChildren:'./main/main.module#MainPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' }
];

@NgModule({
  declarations: [],
  imports: [  
    RouterModule.forChild(routes)
    
  ],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
