import { Component, Input } from '@angular/core';

@Component({
  selector: 'sms-scan-statistics',
  templateUrl: './scan-statistics.component.html',
  styleUrls: ['./scan-statistics.component.scss'],
  standalone: false,
})
export class ScanStatisticsComponent {
  @Input() result: any;

  constructor() {}
}
