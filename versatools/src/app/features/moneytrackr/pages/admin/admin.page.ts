import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {
  today: string; // Default date in ISO format
  milliseconds: number = 0; // Milliseconds for selected or current date
  logMessages: string[] = ['Initializing logs...']; // Logs array
  maxLogs: number = 50; // Maximum log entries
  transactions: any[] = []; // Stores parsed SMS transactions
  public logText$ = new BehaviorSubject<string>(this.logMessages.join('\n')); // Log observable for updates

  constructor(private adminService: AdminService) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    this.today = currentDate.toISOString();
    this.milliseconds = currentDate.getTime();
  }

  ngOnInit(): void { }

  addLog(message: string): void {
    this.logMessages.push(message);
    if (this.logMessages.length > this.maxLogs) {
      this.logMessages.shift(); // Remove oldest log if limit is exceeded
    }
    this.logText$.next(this.logMessages.join('\n')); // Update logs observable
  }

  testLog(): void {
    const testMessage = `Test log at ${new Date().toLocaleTimeString()}`;
    this.addLog(testMessage);
  }

  clearLogs(): void {
    this.logMessages = [];
    this.logText$.next(''); // Clear log observable
    this.transactions = [];
  }

  async smsLookup(): Promise<void> {
    this.transactions = [];
    this.addLog('Scanning SMS from ' + new Date(this.milliseconds).toISOString());

    try {
      const smsFound = await this.adminService.sms.getSMSInbox(this.milliseconds);
      this.addLog(`SMS Found: ${smsFound?.success ? 'Success' : 'Failure'} - ${smsFound?.message || ''}`);

      if (smsFound?.success) {
        for (const e of smsFound.data) {
          try {
            const result = await this.adminService.smsParser.parse(e.body);
            this.transactions.push(result
              ? { ...e, parsedSource: result.source, parsedData: result.data }
              : { ...e, status: 'failure' });
          } catch (error) {
            this.transactions.push({ ...e, status: 'error' });
          }
        }
      }
    } catch (error: any) {
      this.addLog('Error fetching SMS' + error.toString());
    }
  }

  objectKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }

  onDateChange(event: any): void {
    const selectedDateISO = event.detail.value; // Get selected date
    const selectedDate = new Date(selectedDateISO);
    selectedDate.setHours(0, 0, 0, 0); // Reset time to midnight
    this.milliseconds = selectedDate.getTime(); // Update milliseconds
  }
}
