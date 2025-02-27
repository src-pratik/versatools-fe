import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { InboxViewComponent } from './components/inbox-view/inbox-view.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ScanStatisticsComponent } from './components/scan-statistics/scan-statistics.component';
import { SmsProcessingRoutingModule } from './sms-processing-routing.module';
import { HomePageComponent } from './pages/home/home.page';

@NgModule({

  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SmsProcessingRoutingModule
  ],
  declarations: [InboxViewComponent, LoaderComponent, ScanStatisticsComponent, HomePageComponent],
})
export class SmsProcessingModule { }
