import { Component, Input } from '@angular/core';

@Component({
  selector: 'sms-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: false,
})
export class LoaderComponent {
  @Input() isloading: boolean = false;

  constructor() { }
}
