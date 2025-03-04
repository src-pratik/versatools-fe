import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { FormsModule } from '@angular/forms';
import { MoneyTrackrRoutingModule } from './moneytrackr-routing.module';
import { HomePage } from './pages/home/home.page';
import { IonicModule } from '@ionic/angular';
import { HomeService } from './pages/home/home.service';
import { ComponentsModule } from './components/components.module';
import { HistoryPage } from './pages/history/history.page';
import { HistoryService } from './pages/history/history.service';
import { AnalyticsService } from './pages/analytics/analytics.service';
import { AnalyticsPage } from './pages/analytics/analytics.page';
import { ExpensePage } from './pages/expense/expense.page';
import { ExpenseService } from './pages/expense/expense.service';



@NgModule({
  declarations: [HomePage, HistoryPage, AnalyticsPage, ExpensePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MoneyTrackrRoutingModule
  ],
  providers: [
    DatabaseService,
    HomeService,
    HistoryService,
    AnalyticsService,
    ExpenseService
  ]
})
export class MoneyTrackrModule { }
