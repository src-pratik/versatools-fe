import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss'],
  standalone:false
})
export class TransactionSummaryComponent implements OnInit {
  @Input("expense") expense: string | null = null;
  @Input("income") income: string | null = null;

  constructor() { }

  ngOnInit(): void { }

}
