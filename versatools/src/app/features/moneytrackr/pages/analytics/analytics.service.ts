import { Injectable } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { finalize, firstValueFrom, from } from 'rxjs';
import { AbstractUIFeedbackService } from 'src/app/shared/uifeedback.service';
import { DatabaseService } from '../../database.service';
import { ReportCategoryGroupedViewModel } from '../../models';

@Injectable()
export class AnalyticsService extends AbstractUIFeedbackService {

  enableLogs: boolean = false;

  constructor(private db: DatabaseService, loadingController: LoadingController,
    toastController: ToastController, private navCtrl: NavController) {
    super(loadingController, toastController);
  }

  async onFetchDataAsync(month: string, year: string): Promise<ReportCategoryGroupedViewModel | null> {

    if (this.enableLogs) {
      console.log('onFetchDataAsync called');
    }
    const loading = await this.loaderLoadingData();
    await loading.present();

    try {
      var resultOb = this.db.getMonthlyExpenseReport(month, year);

      var output: ReportCategoryGroupedViewModel = await resultOb.finally(async () => {
        await loading.dismiss();
        if (this.enableLogs) {
          console.log('onFetchDataAsync Finalized');
        }
      });

      return output;

    } catch (error) {
      if (this.enableLogs) {
        console.error('Error in onFetchDataAsync:', error);
      }
      return null;
    } finally {
    }
  }

  async onRowClick(month: string, year: string, category: string) {
    this.navCtrl.navigateForward('/moneytrackr/tabs/history', {
      state: {
        data: {
          month: month,
          year: year,
          category: category
        }
      }
    });
  }
}


