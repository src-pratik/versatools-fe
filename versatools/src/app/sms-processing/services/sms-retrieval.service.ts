import { Injectable } from '@angular/core';
import { PluginResponse, SMS } from 'src/app/plugin';

@Injectable({
  providedIn: 'root',
})
export class SMSRetrievalService {
  async getSMSInbox(timestampMillis: number): Promise<PluginResponse> {
    try {
      const result = await SMS.getInbox({ timestamp: timestampMillis, maxresults: timestampMillis === 0 ? 100000 : 100 });

      if (!result.success) {
        console.error('Success is false:', result.message);
        return result;
      }

      console.debug("SMS Received", result.data)

      return result;
    } catch (error: any) {
      console.error('Error retrieving SMS messages:', error.message, error, error.data);
      if (error.data) {
        return error.data;
      }
      return { success: false, message: "Unknown error retrieving SMS messages", data: null };
    }
  }

  async getSMSByHours(hoursAgo: number): Promise<PluginResponse> {
    const timestampMillis = this.calculateTimestampByHours(hoursAgo);
    return await this.getSMSInbox(timestampMillis);
  }

  async getSMSByDays(daysAgo: number): Promise<PluginResponse> {
    const timestampMillis = this.calculateTimestampByDays(daysAgo);
    return await this.getSMSInbox(timestampMillis);
  }
  async getAllSMS(): Promise<PluginResponse> {
    return await this.getSMSInbox(0);
  }

  private calculateTimestampByHours(hoursAgo: number): number {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - hoursAgo);
    return currentDate.getTime(); // Return milliseconds
  }

  private calculateTimestampByDays(daysAgo: number): number {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - daysAgo);
    return currentDate.getTime(); // Return milliseconds
  }
}
