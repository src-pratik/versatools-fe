import { OnChanges, SimpleChange } from '@angular/core';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { Account, Category, ExpenseViewModel } from '../../models';
import { Helper } from '../../helper';

@Component({
  selector: 'app-transaction-expense',
  templateUrl: './transaction-expense.component.html',
  styleUrls: ['./transaction-expense.component.scss'],
  standalone: false
})
export class TransactionExpenseComponent implements OnInit, OnChanges {

  @Input("expense") viewModel: ExpenseViewModel | null = {
    expense: {
      amount: 0,
      account: null,
      category: null,
      date: (new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)).toISOString(),
      remarks: '',
      id: null,
      purpose: 'Expense',
      merchant: null
    },
    categories: null,
    accounts: null,
    maxdate: (new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)).toISOString(),
    purposes: Helper.PurposeList()
  };

  constructor() { }

  //   //This code is written to handle a Null value passed by the parent component.
  //   //The firstChange is important since it will be invoked on the first instance of load.
  //   //The changes has the name of the Input tag, here the @Input is called expense so we expect the expense to be passed.
  ngOnChanges(changes: SimpleChanges): void {
    this.handleOnChangesForExpense(changes['viewModel']);
  }

  ngOnInit() { }

  handleOnChangesForExpense(change: SimpleChange) {

    if (!change)
      return;

    if (change.firstChange)
      if (!change.currentValue)
        this.viewModel = {
          expense: {
            amount: 0,
            account: null,
            category: null,
            date: (new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)).toISOString(),
            remarks: '',
            id: null,
            purpose: "Expense",
            merchant: null
          },
          categories: null,
          accounts: null,
          maxdate: (new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)).toISOString(),
          purposes: Helper.PurposeList()
        }

    //Last tested
    //if (change.currentValue && change.currentValue.accounts) {
    if (change.currentValue && change.currentValue.accounts && change.currentValue.expense.account) {
      change.currentValue.accounts.forEach((element: Account) => {

        if (element.id === change.currentValue.expense.account.id) {
          change.currentValue.expense.account = element
          return;
        }
      });
    }

  }

  onCategorySelect(e: Category) {
    if (this.viewModel?.expense) {
      this.viewModel.expense.category = e;
    }
  }

  onDateChange(e: any) {
    if (this.viewModel?.expense) {
      this.viewModel.expense.date = e?.detail?.value;
    }
  }
}
