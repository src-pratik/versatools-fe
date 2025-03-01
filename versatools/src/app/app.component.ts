import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { MoneyTrackrDatabaseService } from './features/moneytrackr/moneytrackrsqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private moneytrackrDBSetupService: MoneyTrackrDatabaseService) { }

  async ngOnInit(): Promise<void> {
    if (Capacitor.isNativePlatform())
      await this.moneytrackrDBSetupService.initializeDatabase(true);
    else{
      await this.moneytrackrDBSetupService.initWebStore();
      await this.moneytrackrDBSetupService.initializeDatabase(true);
    }
      
  }
}
