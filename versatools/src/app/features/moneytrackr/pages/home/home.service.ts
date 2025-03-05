import { Injectable } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, finalize, firstValueFrom, forkJoin, from, lastValueFrom, of } from 'rxjs';
import { AbstractUIFeedbackService } from 'src/app/shared/uifeedback.service';
import { DatabaseService } from '../../database.service';
import { Transaction, TransactionGroup, TransactionSummary } from '../../models';

@Injectable()
export class HomeService extends AbstractUIFeedbackService {

  enableLogs: boolean = false;

  constructor(private db: DatabaseService, loadingController: LoadingController, toastController: ToastController, private navCtrl: NavController) {
    super(loadingController, toastController);
  }

  private getTransactionSummary(): Observable<TransactionSummary[]> {
    let month = new Date().toLocaleString('default', { month: '2-digit' });
    let year = new Date().getFullYear().toString();
   // return from(this.db.getSummaryForMonthAndToday('09', '2023'));
   return from(this.db.getSummaryForMonthAndToday(month, year));
  }

  private getTransactionRecent(): Observable<TransactionGroup[]> {
    const now = new Date();
    let maxDate: Date;

    if (now.getDate() < 3) {
      maxDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      maxDate = new Date(now);
      maxDate.setDate(maxDate.getDate() - 3);
    }

    const startDate = maxDate.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

   // return from(this.db.getTransactionsForDuration('2023-09-01', '2023-09-04'));
   return from(this.db.getTransactionsForDuration(startDate, endDate));
  }

  async onPageLoadAsync(): Promise<[summary: TransactionSummary[] | null, recent: TransactionGroup[] | null]> {
    if (this.enableLogs) {
      console.log('onPageLoadAsync called');
    }
    const loading = await this.loaderLoadingData();
    await loading.present();

    try {
      const recentOb = this.getTransactionRecent();
      const summaryOb = this.getTransactionSummary();

      const output = await firstValueFrom(forkJoin([summaryOb, recentOb]).pipe(
        finalize(async () => {
          await loading.dismiss();
          if (this.enableLogs) {
            console.log('onPageLoadAsync Finalized');
          }
        })
      ));

      return output;// Return summaryOb and null for recentOb since it is commented out.

    } catch (error) {
      if (this.enableLogs) {
        console.error('Error in onPageLoadAsync:', error);
      }
      return [null, null];
    }
  }
  async onTransactionClick(e: Transaction) {
    this.navCtrl.navigateForward('moneytrackr/expense', { state: e });
  }

  async fetchTransactionSummaryAsync(): Promise<TransactionSummary[] | null> {
    if (this.enableLogs) {
      console.log('fetchTransactionSummaryAsync called');
    }

    const loading = await this.loaderLoadingData();
    await loading.present();

    try {
      const result = await firstValueFrom(
        this.getTransactionSummary().pipe(
          finalize(async () => {
            await loading.dismiss();
            if (this.enableLogs) {
              console.log('fetchTransactionSummaryAsync Finalized');
            }
          })
        )
      );

      if (this.enableLogs) {
        console.log('fetchTransactionSummaryAsync:', result);
      }

      return result;
    } catch (error) {
      if (this.enableLogs) {
        console.error('Error in fetchTransactionSummaryAsync:', error);
      }
      this.toastError('Oops.. Something went wrong!!!');
      throw error;
    }
  }
}