import { Component, Input } from '@angular/core';

@Component({
  selector: 'sms-inbox-view',
  templateUrl: './inbox-view.component.html',
  styleUrls: ['./inbox-view.component.scss'],
  standalone: false,
})
export class InboxViewComponent {
  @Input() transactions: any[] | undefined;

  constructor() {}
}
