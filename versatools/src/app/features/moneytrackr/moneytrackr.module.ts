import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { FormsModule } from '@angular/forms';
import { MoneyTrackrRoutingModule } from './moneytrackr-routing.module';
import { HomePage } from './pages/home/home.page';
import { IonicModule } from '@ionic/angular';
import { HomeService } from './pages/home/home.service';
import { ComponentsModule } from './components/components.module';



@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MoneyTrackrRoutingModule
  ],
  providers: [
    DatabaseService,
    HomeService
  ]
})
export class MoneyTrackrModule { }
