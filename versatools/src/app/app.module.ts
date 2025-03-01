import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SmsProcessingModule } from './sms-processing/sms-processing.module';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { SMSProcessingService } from './sms-processing/services/sms-processing.service';
import { SMSRetrievalService } from './sms-processing/services/sms-retrieval.service';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, SmsProcessingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  {
    provide: SQLiteConnection,
    useFactory: () => new SQLiteConnection(CapacitorSQLite),
  },
    SMSProcessingService,
    SMSRetrievalService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
