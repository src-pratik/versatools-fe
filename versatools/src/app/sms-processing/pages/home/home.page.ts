import { Component, OnInit } from '@angular/core';
import { SMSProcessingService } from '../../services/sms-processing.service';
// import { SMSTransactionService } from '../../services/sms-transaction.service';
// import { ExportService } from '../../services/export.service';

@Component({
  selector: 'sms-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePageComponent implements OnInit {
  scanResult: any = null;
  transactions: any[] = [];
  isLoading: boolean = false;

  constructor(
    private smsProcessingService: SMSProcessingService,
    // private smsTransactionService: SMSTransactionService,
    // private exportService: ExportService
  ) { }

  async ngOnInit() {
    // await this.updateDatabaseView();
    let x = this.smsProcessingService.getLastScanTimestamp();
    if (x) {
      this.scanResult = {
        lastScan: x,
      };
    }
  }

  async scanByHours(hours: number) {
    this.isLoading = true;
    let result = await this.smsProcessingService.processSMSByHours(hours);
    this.transactions = result.data;
    await this.updateScanStatistics(result.success, hours, 'hours', result.message);
    //  await this.updateDatabaseView();
    this.isLoading = false;
  }

  async scanByDays(days: number) {
    this.isLoading = true;
    let result = await this.smsProcessingService.processSMSByDays(days);
    this.transactions = result.data;
    await this.updateScanStatistics(result.success, days, 'days', result.message);
    //  await this.updateDatabaseView();
    this.isLoading = false;
  }

  async scanAll() {
    this.isLoading = true;
    let result = await this.smsProcessingService.processSMSAll();
    this.transactions = result.data;
    await this.updateScanStatistics(result.success, '', 'all', result.message);
    //  await this.updateDatabaseView();
    this.isLoading = false;
  }

  async updateScanStatistics(success: boolean, interval: any, type: 'hours' | 'days' | 'all', errormessage?: string) {
    const processedCount = this.transactions?.length; // Update with actual processed count if available

    // Create the scan result object with conditional logic
    if (success) {
      this.scanResult = {
        message: `Scan for the last ${interval} ${type} completed successfully.`,
        processedCount: processedCount,
        lastScan: this.smsProcessingService.getLastScanTimestamp(),
      };
    } else {
      this.scanResult = {
        message: `Scan failed: ${errormessage || 'Unknown error occurred.'}`,
        processedCount: processedCount,
        lastScan: this.smsProcessingService.getLastScanTimestamp(),
      };
    }
  }


  // async updateDatabaseView() {
  //   this.transactions = await this.smsTransactionService.getUnsyncedTransactions();
  // }

  // async exportDatabase() {
  //   await this.exportService.exportDatabase();
  // }
}
