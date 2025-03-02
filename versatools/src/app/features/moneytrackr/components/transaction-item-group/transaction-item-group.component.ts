import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../../models';

@Component({
  selector: 'app-transaction-item-group',
  templateUrl: './transaction-item-group.component.html',
  styleUrls: ['./transaction-item-group.component.scss'],
  standalone: false
})
export class TransactionItemGroupComponent implements OnInit {

  @Input("title") title: string | null = null;
  @Input("data") data: Transaction[] | null = null;

  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onItemClick(data: any) {
    this.onSelect.emit(data);
  }

}
