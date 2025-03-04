import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
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
        redirectTo: 'home', // ✅ Redirect within TabsPage (NO `/tabs/` prefix)
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs', // ✅ Redirect root to 'tabs'
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoneyTrackrRoutingModule { }
