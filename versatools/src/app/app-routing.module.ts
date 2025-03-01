import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'garage',
    loadChildren: () => import('./garage/garage.module').then(m => m.GarageModule)
  },
  {
    path: 'sms-processing',
    loadChildren: () => import('./sms-processing/sms-processing.module').then(m => m.SmsProcessingModule)
  },
  {
    path: 'moneytrackr',
    loadChildren: () => import('./features/moneytrackr/moneytrackr.module').then(m => m.MoneyTrackrModule)
  },
  {
    path: '',
    redirectTo: 'moneytrackr',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
