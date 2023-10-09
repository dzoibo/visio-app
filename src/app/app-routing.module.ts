import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallManagerComponent } from './call-manager/call-manager.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
  },
  {
    path:'meeting',
    component:CallManagerComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
