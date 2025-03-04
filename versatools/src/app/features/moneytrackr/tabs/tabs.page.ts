import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
export class TabsPage {

  summaryData: any = {
    today: { income: 1000, expense: 500 },
    thisWeek: { income: 5000, expense: 2000 },
    thisMonth: { income: 10000, expense: 3000 },
  };

  constructor(private navController: NavController) { }
  onAddExpenseClick() {

    this.navController.navigateRoot("expense")

  }
}
