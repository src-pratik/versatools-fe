import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Observable, finalize, firstValueFrom, forkJoin, from, map, of } from 'rxjs';
import { AbstractUIFeedbackService } from 'src/app/shared/uifeedback.service';
import { Account, Category, Expense } from '../../models';
import { DatabaseService } from '../../database.service';


@Injectable()
export class ExpenseService extends AbstractUIFeedbackService {
  enableLogs: boolean = false;
  categories: Category[] | null = null;
  accounts: Account[] | null = null;

  constructor(private db: DatabaseService, loadingController: LoadingController, toastController: ToastController, private navCtrl: NavController,) {
    super(loadingController, toastController);
  }

  async onPageLoadAsync(expenseId: string = ''): Promise<[Category[] | null, Account[] | null, Expense | null]> {
    if (this.enableLogs) {
      console.log('onPageLoadAsync called');
    }

    const loading = await this.loaderLoadingData();
    await loading.present();

    try {
      // Fetching categories and accounts asynchronously
      const accountsPromise = this.db.getAccounts(); // Uses cache unless forced
      const categoriesPromise = this.db.getCategoryLookup(); // Uses cache unless forced
      const expensePromise = this.db.getExpense(expenseId);

      // Await all promises
      const [categories, accounts, expense] = await Promise.all([
        categoriesPromise,
        accountsPromise,
        expensePromise
      ]);

      // Sorting categories and accounts
      this.categories = categories?.sort((a, b) => a.order - b.order) || [];
      this.accounts = accounts?.sort((a, b) => a.order - b.order) || [];

      return [this.categories, this.accounts, expense];

    } catch (error) {
      console.error("Error in onPageLoadAsync:", error);
      return [null, null, null];
    } finally {
      await loading.dismiss();
      if (this.enableLogs) {
        console.log('onPageLoadAsync Finalized');
      }
    }
  }

  async onSaveClick(expense: Expense) {
    if (this.enableLogs) {
      console.log('onSaveClick called');
    }

    const loading = await this.loaderProcessing();
    await loading.present(); // Show loader before processing

    try {
      // Await the database save operation
      await this.db.saveTransaction(expense);

      // Show success toast
      await this.toastSuccess("Expense has been recorded.");

      // Navigate back after successful save
      await this.navCtrl.back();
    } catch (e) {
      console.error("Error in onSaveClick:", e);
      await this.toastError("Error while processing your request ...");
    } finally {
      // Ensure the loader is dismissed even if an error occurs
      await loading.dismiss();
      if (this.enableLogs) {
        console.log('onSaveClick Finalized');
      }
    }
  }

  async onCancelClick() {
    await this.navCtrl.navigateRoot("/moneytrackr/tabs/home");
  }

  formatNumberString(input: string): string {
    const parsedValue = parseFloat(input);

    if (isNaN(parsedValue)) {
      return "0.00";
    }

    return parsedValue.toFixed(2);
  }

  validate(expense: Expense) {

    if (!expense)
      return false;

    if (expense.account === null) {
      return false;
    }

    if (expense.amount < 0.1) {
      return false;
    }

    if (expense.category === null) {
      return false;
    }

    if (expense.date === null) {
      return false;
    }

    return true;
  }

}
