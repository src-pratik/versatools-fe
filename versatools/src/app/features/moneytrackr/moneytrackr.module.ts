import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from './components/components.module';
import { DatabaseService } from './database.service';
import { MoneyTrackrRoutingModule } from './moneytrackr-routing.module';
import { TabsPage } from './tabs/tabs.page';



@NgModule({
  declarations: [TabsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MoneyTrackrRoutingModule
  ],
  providers: [
    DatabaseService
  ]
})
export class MoneyTrackrModule { }
