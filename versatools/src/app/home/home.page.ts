import { Component } from '@angular/core';
import Echo from '../plugin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  index: number = 0;
  output: string = 'Click Echo';

  constructor(private router: Router) { }

  navigateToSMSProcessing() {
    this.router.navigate(['/sms-processing']);
  }

  async echoButton() {
    this.index++;

    const { value } = await Echo.echo({ value: 'Hello World! ' + this.index });
    this.output = value;
    console.log('Response from native:', value);
  }
  async showError() {
    this.index++;

    const { value } = await Echo.echo({ value: 'showerror' });
    this.output = value;

  }
}
