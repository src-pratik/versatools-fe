import { Component, OnInit } from '@angular/core';

import { HistoryService } from './history.service';

import { ActivatedRoute } from '@angular/router';
import { __await } from 'tslib';
import { Category, TransactionGroup, TransactionSummary } from '../../models';
import { Helper } from '../../helper';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage implements OnInit {
  enableLogs: boolean = false;

  yearslist: string[] | null = null;
  monthslist: { index: number, month: string, value: string }[] | null = null;
  monthselected: string = "01";
  yearselected: string = new Date().getFullYear().toString();

  categorylist: Category[] | null = null;
  categoryselected: Category | null = null;

  transactionsummarydata: TransactionSummary[] | null = null;
  transactionactivitydata: TransactionGroup[] | null = null;

  constructor(private historyService: HistoryService, private route: ActivatedRoute) { }

  async setDefaultFilters() {
    this.monthselected = new Date().toLocaleString('default', { month: 'numeric' }).padStart(2, "0");
    this.monthslist = Helper.MonthListForYear(Number(this.yearselected));
    this.yearslist = Helper.YearList();

    this.categorylist = await this.historyService.getCategoryListAsync();
  }

  async listenToRouteStageChangesAsync() {
    let sub = this.route.paramMap.subscribe(async params => {
      const data = history.state?.data;

      if (this.enableLogs)
        console.log("Expense activated route state", data)

      if (data !== undefined && data !== null) {
        this.monthselected = data?.month;
        this.categorylist?.forEach(x => {
          if (x.id === data.category) {
            this.categoryselected = x;
          }
        });
      }

      await this.onFilterChange();
    });

  }

  async ngOnInit() {
    if (this.enableLogs)
      console.log("Calling On PageLoad")
    await this.onPageLoad();
  }

  async onFilterChange() {
    this.resetData();
    let result = await this.historyService.onFetchDataAsync(this.monthselected, this.yearselected, this.categoryselected?.id);
    this.transactionsummarydata = result[0]
    this.transactionactivitydata = result[1]

    console.log(result[0], result[1])
  }

  async onSelectYearChange() {
    this.monthslist = Helper.MonthListForYear(Number(this.yearselected));
    this.onFilterChange();
  }

  async onPageLoad() {
    await this.setDefaultFilters();
    console.log("Default filters set.")
    await this.listenToRouteStageChangesAsync();
    console.log("Reading the route information complete")

  }

  async handleRefresh(e: any) {
    await this.onPageLoad();
    e.target.complete();
  }

  async onTransactionClick(e: any) {
    await this.historyService.onTransactionClick(e);
  }

  private resetData() {
    this.transactionsummarydata = null;
    this.transactionactivitydata = null
  }

  valueNull() {
    return null;
  }
}
