import { Injectable } from '@angular/core';
import { SMSRetrievalService } from './sms-retrieval.service';
import { PluginResponse } from 'src/app/plugin';
//import { SMSTransactionService } from './sms-transaction.service';

@Injectable({
  providedIn: 'root',
})
export class SMSProcessingService {
  private lastScanTimestamp: string | null = null;

  constructor(
    private smsRetrievalService: SMSRetrievalService,
    //  private smsTransactionService: SMSTransactionService
  ) {
    this.loadLastScanTimestamp();
  }

  async processSMSAll(): Promise<PluginResponse> {
    const result = await this.smsRetrievalService.getAllSMS();
    this.updateLastScanTimestamp();
    return result;
  }

  async processSMSByHours(hours: number): Promise<PluginResponse> {
    const smsMessages = await this.smsRetrievalService.getSMSByHours(hours);
    this.updateLastScanTimestamp();
    return smsMessages;
  }

  async processSMSByDays(days: number): Promise<PluginResponse> {
    const smsMessages = await this.smsRetrievalService.getSMSByDays(days);
    this.updateLastScanTimestamp();
    return smsMessages;
  }

  private updateLastScanTimestamp() {
    this.lastScanTimestamp = new Date().toISOString();
    localStorage.setItem('lastScanTimestamp', this.lastScanTimestamp);
  }

  private loadLastScanTimestamp() {
    this.lastScanTimestamp = localStorage.getItem('lastScanTimestamp');
  }

  getLastScanTimestamp(): string | null {
    return this.lastScanTimestamp;
  }
}
