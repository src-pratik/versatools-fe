import { Component, OnInit } from '@angular/core';
import { Purpose, CreditOrDebitType, CreditOrDebit, RecordStatus } from '../../dbmodel';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: false
})
export class TestPage implements OnInit {

  constructor(private db: DatabaseService) { }

  ngOnInit() {
  }

  onInsertTransactionClick() {
    const currentDate = new Date();
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDay().toString().padStart(2, "0")} `
    this.db.addTransaction({
      amount: 100 * 1000,
      beneficiary: 'Test bene',
      createDate: dateString,
      date: dateString,
      purpose: Purpose.Expense,
      transactionId: (Math.random() * 99999).toString(),
      accountId: 1,
      creditOrDebit: CreditOrDebit.Debit,
      categoryId: 13,
      account: 'XXXXXXXXX033',
      source: 'ICICI',
      status: RecordStatus.Active
    });
  }
}
