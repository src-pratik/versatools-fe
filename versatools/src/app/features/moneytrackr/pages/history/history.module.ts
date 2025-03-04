import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPageRoutingModule } from './history-routing.module';

import { HistoryPage } from './history.page';
import { ComponentsModule } from '../../components/components.module';
import { HistoryService } from './history.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, ComponentsModule,
    HistoryPageRoutingModule
  ],
  declarations: [HistoryPage],
  exports: [HistoryPage],
  providers: [HistoryService],
})
export class HistoryPageModule { }
