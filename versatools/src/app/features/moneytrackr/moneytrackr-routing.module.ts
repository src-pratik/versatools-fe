import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { HistoryPage } from './pages/history/history.page';
import { AnalyticsPage } from './pages/analytics/analytics.page';
import { ExpensePage } from './pages/expense/expense.page';

const routes: Routes = [
  {
    path: 'expense',
    loadChildren: () => import('./pages/expense/expense.module').then(m => m.ExpensePageModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./pages/analytics/analytics.module').then(m => m.AnalyticsPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoneyTrackrRoutingModule { }
