import { Component, OnDestroy, OnInit } from '@angular/core';

import { HistoryService } from './history.service';

import { ActivatedRoute } from '@angular/router';
import { __await } from 'tslib';
import { Category, TransactionGroup, TransactionSummary } from '../../models';
import { Helper } from '../../helper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage implements OnInit, OnDestroy {
  enableLogs: boolean = true;

  yearslist: string[] | null = Helper.YearList();;
  monthslist: { index: number, month: string, value: string }[] | null = null;
  monthselected: string = String(new Date().getMonth() + 1).padStart(2, "0");
  yearselected: string = new Date().getFullYear().toString();

  categorylist: Category[] | null = null;
  categoryselected: Category | null = null;

  transactionsummarydata: TransactionSummary[] | null = null;
  transactionactivitydata: TransactionGroup[] | null = null;

  private routeSub: Subscription | null = null;

  constructor(private historyService: HistoryService, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.log("Calling On PageLoad");
    this.initializePage();
  }

  ngOnDestroy(): void {
    this.unsubscribeRoute();
  }

  private log(message: string, data?: any) {
    if (this.enableLogs) {
      console.log(message, data ?? '');
    }
  }

  private unsubscribeRoute() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
      this.routeSub = null;
    }
  }

  private resetData() {
    this.transactionsummarydata = null;
    this.transactionactivitydata = null;
  }

  private async initializePage() {
    if (!history.state?.data) {
      this.categorylist = await this.historyService.getCategoryListAsync();
      this.monthslist = Helper.MonthListForYear(Number(this.yearselected));

      this.log("Default filters set.");
    }
    await this.listenToRouteChanges();
    this.log("Route listening initialized.");

    if (!history.state?.data)
      this.onFilterChange();
  }

  private listenToRouteChanges() {
    this.unsubscribeRoute();

    this.routeSub = this.route.paramMap.subscribe(async () => {
      const data = history.state?.data;
      this.log("Activated route state", data);

      if (data) {
        this.categorylist = await this.historyService.getCategoryListAsync();
        this.yearselected = data.year ?? this.yearselected;
        this.monthslist = Helper.MonthListForYear(Number(this.yearselected));

        this.monthselected = data.month ?? this.monthselected;
        const categoryIdToFind = String(data.category)
        this.categoryselected = this.categorylist?.find(x => x.id === categoryIdToFind) || null;
      }
      await this.onFilterChange();
    });
  }

  async onFilterChange() {
    this.resetData();
    this.log("Applying filter", { month: this.monthselected, year: this.yearselected, category: this.categoryselected?.id });

    const result = await this.historyService.onFetchDataAsync(
      this.monthselected,
      this.yearselected,
      this.categoryselected?.id
    );

    this.transactionsummarydata = result[0];
    this.transactionactivitydata = result[1];

    this.log("Fetched data", result);
  }

  async onSelectYearChange() {
    this.monthslist = Helper.MonthListForYear(Number(this.yearselected));
    this.onFilterChange();
  }

  async handleRefresh(e: any) {
    await this.onFilterChange();
    e.target.complete();
  }

  async onTransactionClick(e: any) {
    await this.historyService.onTransactionClick(e);
  }

  valueNull() {
    return null;
  }
}
