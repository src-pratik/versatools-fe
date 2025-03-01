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
    let data = [{ "display": "Monthly", "key": "monthly", "expense": "46408.31", "income": "0.00" },
    { "display": "Today", "key": "today", "expense": "245", "income": "0.00" }]
    this.transactionsummarydata = result[0];
    //  this.transactionactivitydata = result[1]
    //console.log(this.transactionsummarydata);
  }

  async handleRefresh(e: any) {
    await this.onPageLoad();
    e.target.complete();
  }

  async onTransactionClick(e: any) {
    await this.homeService.onTransactionClick(e);
  }

}
