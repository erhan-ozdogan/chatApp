import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'chat', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadChildren: './home/home.module#HomePageModule'
  },
  { 
    path: 'chat', 
    loadChildren: './chat/chat.module#ChatModule' 
},
{ 
  path: '**', 
  redirectTo: 'chat', 
  pathMatch: 'full' 
}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
