import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpensePageRoutingModule } from './expense-routing.module';

import { ExpensePage } from './expense.page';
import { ComponentsModule } from '../../components/components.module';
import { ExpenseService } from './expense.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpensePageRoutingModule,
    ComponentsModule
  ],
  declarations: [ExpensePage],
  exports: [ExpensePage],
  providers: [ExpenseService],

})
export class ExpensePageModule { }
