import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { TransactionGroup, TransactionSummary } from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  transactionsummarydata: TransactionSummary[] | null = null;

  transactionactivitydata: TransactionGroup[] | null = null;

  constructor(private homeService: HomeService) { }

  async ngOnInit() {
    await this.onPageLoad();
  }


  async onPageLoad() {
    let result = await this.homeService.onPageLoadAsync();
    this.transactionsummarydata = result[0]
    this.transactionactivitydata = result[1]

  }

  async handleRefresh(e: any) {
    await this.onPageLoad();
    e.target.complete();
  }

  async onTransactionClick(e: any) {
    await this.homeService.onTransactionClick(e);
  }

}
