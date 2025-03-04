import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnalyticsPageRoutingModule } from './analytics-routing.module';

import { AnalyticsPage } from './analytics.page';
import { ComponentsModule } from '../../components/components.module';
import { AnalyticsService } from './analytics.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AnalyticsPageRoutingModule,
  ],
  declarations: [AnalyticsPage],
  providers: [AnalyticsService],
})
export class AnalyticsPageModule { }
