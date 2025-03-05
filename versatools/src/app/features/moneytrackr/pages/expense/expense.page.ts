import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ExpenseService } from './expense.service';
import { ExpenseViewModel } from '../../models';
import { Helper } from '../../helper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
  standalone: false
})
export class ExpensePage implements OnInit {
  enableLogs: boolean = false;

  viewModel: ExpenseViewModel = {
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

  constructor(private expenseService: ExpenseService, private cdr: ChangeDetectorRef, private route: ActivatedRoute,) { }

  async ngOnInit() {
    let expenseId = '';

    await this.route.paramMap.subscribe(params => {
      const state = history.state;

      if (this.enableLogs)
        console.log("Expense activated route state", state)

      if (state) {
        expenseId = state?.id;
      } else {

      }
    });

    await this.onPageLoad(expenseId);

  }


  async onPageLoad(expenseId: string) {
    let result = await this.expenseService.onPageLoadAsync(expenseId);

    console.log(result)
    this.viewModel.categories = result[0]
    this.viewModel.accounts = result[1]

    if (result[2]) {
      this.viewModel = {
        ...this.viewModel, expense: result[2]
      }
    }
    // this.viewModel.expense = result[2]
  }

  // Refer this for EDIT Mode
  // if (this.viewModel && this.viewModel.expense) {
  //   this.viewModel = {
  //     ...this.viewModel, expense: {
  //       "amount": 786,
  //       "account": {
  //         "id": "4",
  //         "name": "Credit Card 001",
  //         "order": 1
  //       },
  //       "category": {
  //         "id": "5",
  //         "name": "Transportation",
  //         "icon": "bus-outline",
  //         "color": "#9E5446",
  //         "order": 1
  //       },
  //       "date": "2023-06-15T00:43:00",
  //       "remarks": "",
  //       "id": null
  //     }

  isValid() {
    if (this.viewModel.expense)
      return this.expenseService.validate(this.viewModel.expense);

    return false;
  }

  async onSaveClick() {
    if (this.viewModel.expense)
      await this.expenseService.onSaveClick(this.viewModel.expense);
  }
  async onCancelClick() {

    await this.expenseService.onCancelClick();
  }


  //Testingn code
  // async onCancelClick() {
  //   if (this.viewModel.expense) {
  //     const updatedExpense = { ...this.viewModel.expense }; // Create a new object reference
  //     updatedExpense.amount = updatedExpense.amount + 1;

  //     // Update the viewModel object with the new reference
  //     this.viewModel = {
  //       ...this.viewModel,
  //       expense: updatedExpense
  //     };
  //   }
  // }

}
