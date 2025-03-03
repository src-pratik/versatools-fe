import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { HistoryPage } from './pages/history/history.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoneyTrackrRoutingModule { }
