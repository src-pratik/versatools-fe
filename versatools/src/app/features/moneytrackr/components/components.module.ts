import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';
import { TransactionSummaryGroupComponent } from './transaction-summary-group/transaction-summary-group.component';
import { TransactionItemComponent } from './transaction-item/transaction-item.component';
import { TransactionItemGroupComponent } from './transaction-item-group/transaction-item-group.component';
// import { TransactionItemComponent } from './transaction-item/transaction-item.component';
// import { TransactionItemGroupComponent } from './transaction-item-group/transaction-item-group.component';
// import { CategoryListHorizontalComponent } from './category-list-horizontal/category-list-horizontal.component';

// import { TransactionExpenseComponent } from './transaction-expense/transaction-expense.component';
// import { CategoryGroupedComponent } from '../report/category-grouped/category-grouped.component';



@NgModule({
  declarations: [
    TransactionSummaryComponent,
    TransactionSummaryGroupComponent,
    TransactionItemComponent,
    TransactionItemGroupComponent
    //  TransactionItemComponent, TransactionItemGroupComponent,
    //CategoryListHorizontalComponent, TransactionExpenseComponent, CategoryGroupedComponent
  ],
  imports: [
    CommonModule, FormsModule, IonicModule,
  ],
  exports: [
    TransactionSummaryGroupComponent,
    TransactionItemGroupComponent
    //  TransactionItemGroupComponent, CategoryListHorizontalComponent, TransactionExpenseComponent, CategoryGroupedComponent
  ]
})
export class ComponentsModule { }
