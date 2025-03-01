import { Injectable } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable, finalize, firstValueFrom, forkJoin, from, lastValueFrom, of } from 'rxjs';
import { AbstractUIFeedbackService } from 'src/app/shared/uifeedback.service';
import { DatabaseService } from '../../database.service';
import { Transaction, TransactionSummary } from '../../models';

@Injectable()
export class HomeService extends AbstractUIFeedbackService {

  enableLogs: boolean = false;

  constructor(private db: DatabaseService, loadingController: LoadingController, toastController: ToastController, private navCtrl: NavController) {
    super(loadingController, toastController);
  }

  private getTransactionSummary(): Observable<any> {
    let month = new Date().toLocaleString('default', { month: '2-digit' });
    let year = new Date().getFullYear().toString();
    return from(this.db.getSummary('09', '2023'));
  }

  // private getTransactionRecent(): Observable<TransactionGroup[]> {
  //   return this.http.get<TransactionGroup[]>(`${environment.apiBaseUrl}/transaction/recent`)
  // }

  async onPageLoadAsync(): Promise<[summary: TransactionSummary[] | null, recent: any | null]> {
    if (this.enableLogs) {
      console.log('onPageLoadAsync called');
    }
    const loading = await this.loaderLoadingData();
    await loading.present();

    try {

      const summaryOb = await firstValueFrom(this.getTransactionSummary().pipe(
        finalize(async () => {
          await loading.dismiss();
          if (this.enableLogs) {
            console.log('onPageLoadAsync Finalized');
          }
        })
      ));
      // const recentOb = this.getTransactionRecent();

      // const output = await firstValueFrom(forkJoin([summaryOb, recentOb]).pipe(
      //     finalize(async () => {
      //         await loading.dismiss();
      //         if (this.enableLogs) {
      //             console.log('onPageLoadAsync Finalized');
      //         }
      //     })
      // ));

      return [summaryOb as TransactionSummary[], null]; // Return summaryOb and null for recentOb since it is commented out.

    } catch (error) {
      if (this.enableLogs) {
        console.error('Error in onPageLoadAsync:', error);
      }
      return [null, null];
    }
  }
  async onTransactionClick(e: Transaction) {
    this.navCtrl.navigateForward('/expense', { state: e });
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