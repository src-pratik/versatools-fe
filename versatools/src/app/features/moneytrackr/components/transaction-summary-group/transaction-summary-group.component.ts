import { Component, Input, OnInit } from '@angular/core';
import { TransactionSummary } from '../../models';

@Component({
  selector: 'app-transaction-summary-group',
  templateUrl: './transaction-summary-group.component.html',
  styleUrls: ['./transaction-summary-group.component.scss'],
  standalone:false
})
export class TransactionSummaryGroupComponent implements OnInit {

  @Input("data") data: TransactionSummary[] | null = null;

  selectedKey: string | null = '';
  selectedItem: TransactionSummary | null = null;

  constructor() { }

  ngOnInit() {

    if (this.data)
      if (this.data.length > 0) {
        this.selectedKey = this.data[0].key; // Default to the first item
      }
    this.onSegmentChange()
  }


  onSegmentChange() {
    if (this.data === null) {
      this.selectedItem = null;
      return;
    }
    this.selectedItem = this.data.find(item => item.key === this.selectedKey) ?? null;
  }
}
