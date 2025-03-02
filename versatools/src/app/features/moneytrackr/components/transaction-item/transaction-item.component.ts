import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../../models';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  standalone:false
})
export class TransactionItemComponent implements OnInit {

  @Input("data") data: Transaction | null = null;
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  handleTransactionItemClick(data: any) {
    this.onSelect.emit(data);
  }
}
