import { Injectable } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, finalize, firstValueFrom, forkJoin, from, lastValueFrom, of } from 'rxjs';
import { AbstractUIFeedbackService } from 'src/app/shared/uifeedback.service';
import { Category, Transaction, TransactionGroup, TransactionSummary } from '../../models';
import { DatabaseService } from '../../database.service';

@Injectable()
export class HistoryService extends AbstractUIFeedbackService {

  enableLogs: boolean = false;

  constructor(private db: DatabaseService, loadingController: LoadingController, toastController: ToastController,
    private navCtrl: NavController) {
    super(loadingController, toastController);
  }


  private getTransactionSummaryForMonthYear(month: string, year: string, category: string | null): Observable<TransactionSummary[]> {
    if (this.enableLogs)
      console.log('getTransactionSummaryForMonthYear called', month, year, category);

    return from(this.db.getSummaryForMonth(month, year, category));
  }

  private getTransactionForMonthYear(month: string, year: string, category: string | null): Observable<TransactionGroup[]> {
    if (this.enableLogs)
      console.log('getTransactionForMonthYear called', month, year, category);
    // Create a date object for the first day of the month
    const firstDate = new Date(+year, +month - 1, 1);
    // Manually calculate the last day of the month
    const lastDate = new Date(+year, +month, 0);

    const fromDate = `${firstDate.getFullYear()}-${(firstDate.getMonth() + 1).toString().padStart(2, '0')}-${firstDate.getDate().toString().padStart(2, '0')}`;
    const toDate = `${lastDate.getFullYear()}-${(lastDate.getMonth() + 1).toString().padStart(2, '0')}-${lastDate.getDate().toString().padStart(2, '0')}`;

    return from(this.db.getTransactionsForDuration(fromDate, toDate, category));

  }

  async getCategoryListAsync(): Promise<Category[] | null> {
    if (this.enableLogs) {
      console.log('getCategoryListAsync called');
    }

    const loading = await this.loaderLoadingData();
    await loading.present();

    try {
      const output: Category[] = await this.db.getCategoryLookup(false); // Directly await the Promise

      return output;
    } catch (error) {
      if (this.enableLogs) {
        console.error('Error in getCategoryListAsync:', error);
      }
      return null;
    } finally {
      await loading.dismiss(); // Ensure loading is dismissed in all cases
      if (this.enableLogs) {
        console.log('getCategoryListAsync Finalized');
      }
    }
  }


  async onFetchDataAsync(month: string, year: string, category: string | undefined | null): Promise<[summary: TransactionSummary[] | null, recent: TransactionGroup[] | null]> {

    if (this.enableLogs) {
      console.log('onFetchDataAsync called', category);
    }
    const loading = await this.loaderLoadingData();
    await loading.present();

    try {

      var categoryId = null;

      if (category !== null && category !== undefined)
        categoryId = category;

      if (this.enableLogs) {
        console.log('onFetchDataAsync called', categoryId);
      }
      var summaryOb = this.getTransactionSummaryForMonthYear(month, year, categoryId);
      var recentOb = this.getTransactionForMonthYear(month, year, categoryId);

      var output: [TransactionSummary[] | null, TransactionGroup[] | null] = await firstValueFrom(forkJoin([summaryOb, recentOb]).pipe(
        finalize(async () => {
          await loading.dismiss();
          if (this.enableLogs) {
            console.log('onFetchDataAsync Finalized');
          }
        })
      ));

      if (output[0]?.length == 0)
        output[0] = null;
      if (output[1]?.length == 0)
        output[1] = null;


      return output;
      // return [null, null]

    } catch (error) {
      if (this.enableLogs) {
        console.error('Error in onFetchDataAsync:', error);
      }
      return [null, null];
    } finally {
    }
  }

  async onTransactionClick(e: Transaction) {
    this.navCtrl.navigateForward('moneytrackr/expense', { state: e });
  }
}