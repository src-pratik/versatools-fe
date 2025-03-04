import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { HistoryPage } from './pages/history/history.page';
import { AnalyticsPage } from './pages/analytics/analytics.page';
import { ExpensePage } from './pages/expense/expense.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoneyTrackrRoutingModule { }
