import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { UserTestComponent } from '../database/user/user.component';
import { ImportexportComponent } from '../database/importexport/importexport.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'user',
    component: UserTestComponent,
  },{
    path: 'importexport',
    component: ImportexportComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
