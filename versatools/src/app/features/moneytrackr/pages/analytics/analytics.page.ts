import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { ActivatedRoute } from '@angular/router';
import { Helper } from '../../helper';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: false
})
export class AnalyticsPage implements OnInit {

  monthslist: { index: number, month: string, value: string }[] | null = null;
  yearslist: string[] | null = null;
  monthselected: string = "01";
  yearselected: string = new Date().getFullYear().toString();
  viewModel: any | null = null;

  constructor(private analyticsService: AnalyticsService, private route: ActivatedRoute) { }

  setDefaultFilters() {
    this.monthselected = new Date().toLocaleString('default', { month: 'numeric' }).padStart(2, "0");
    this.monthslist = Helper.MonthListForYear(Number(this.yearselected));
    this.yearslist = Helper.YearList();
  }

  async ngOnInit() {
    await this.setDefaultFilters();
    await this.onPageLoad();
  }

  async onSelectMonthChange() {
    await this.onPageLoad();
  }

  async onSelectYearChange() {
    this.monthslist = Helper.MonthListForYear(Number(this.yearselected));
    await this.onPageLoad();
  }

  async onPageLoad() {
    this.viewModel = null;
    let result = await this.analyticsService.onFetchDataAsync(this.monthselected, this.yearselected);
    this.viewModel = result
  }

  async handleRefresh(e: any) {
    await this.onPageLoad();
    e.target.complete();
  }

  async onRowClick(e: any) {
    await this.analyticsService.onRowClick(this.monthselected, this.yearselected, e?.category?.id)
  }

}
