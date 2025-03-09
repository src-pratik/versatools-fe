import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from './components/components.module';
import { DatabaseService } from './database.service';
import { MoneyTrackrRoutingModule } from './moneytrackr-routing.module';
import { TabsPage } from './tabs/tabs.page';
import { ExpensePageModule } from './pages/expense/expense.module';
import { TransactionService } from './transaction.service';



@NgModule({
  declarations: [TabsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ExpensePageModule,
    MoneyTrackrRoutingModule
  ],
  providers: [
    DatabaseService,
    TransactionService
  ]
})
export class MoneyTrackrModule { }
