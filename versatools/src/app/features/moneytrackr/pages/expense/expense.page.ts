import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ExpenseService } from './expense.service';
import { ExpenseViewModel } from '../../models';
import { Helper } from '../../helper';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
  standalone: false
})
export class ExpensePage implements OnInit, OnDestroy {
  enableLogs: boolean = true;
  redirectTo: string = "home";

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
  private routeSub: Subscription | null = null;

  constructor(private expenseService: ExpenseService, private cdr: ChangeDetectorRef, private route: ActivatedRoute,) { }

  ngOnDestroy() {
    this.unsubscribeRoute();
  }

  private unsubscribeRoute() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
      this.routeSub = null;
    }
  }

  private log(message: string, data?: any) {
    if (this.enableLogs) {
      console.log(message, data ?? '');
    }
  }

  ngOnInit() {
    this.log("Initializing Page");
    this.listenToRouteChanges();

  }

  private listenToRouteChanges() {
    this.unsubscribeRoute();

    this.routeSub = this.route.paramMap.subscribe(async () => {
      const state = history.state;
      this.log("Activated route state", state);

      const expenseId = state?.expense.id ?? '';
      if (state?.from) {
        this.redirectTo = state?.from
      }

      await this.onPageLoad(expenseId);
    });
  }

  private async onPageLoad(expenseId: string) {
    this.log("Fetching Page Data", { expenseId });

    const [categories, accounts, expenseData] = await this.expenseService.onPageLoadAsync(expenseId);

    this.log("Fetching Page Data", [categories, accounts, expenseData]);

    this.viewModel.categories = categories;
    this.viewModel.accounts = accounts;

    if (accounts && !expenseData && this.viewModel.expense)
      this.viewModel.expense.account = accounts[0];

    if (expenseData)
      this.viewModel.expense = expenseData

    this.viewModel = { ...this.viewModel };
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

    await this.expenseService.onCancelClick(this.redirectTo);
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
