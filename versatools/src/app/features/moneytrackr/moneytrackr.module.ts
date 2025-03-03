import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { FormsModule } from '@angular/forms';
import { MoneyTrackrRoutingModule } from './moneytrackr-routing.module';
import { HomePage } from './pages/home/home.page';
import { IonicModule } from '@ionic/angular';
import { HomeService } from './pages/home/home.service';
import { ComponentsModule } from './components/components.module';
import { HistoryPage } from './pages/history/history.page';
import { HistoryService } from './pages/history/history.service';



@NgModule({
  declarations: [HomePage, HistoryPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MoneyTrackrRoutingModule
  ],
  providers: [
    DatabaseService,
    HomeService,
    HistoryService
  ]
})
export class MoneyTrackrModule { }
