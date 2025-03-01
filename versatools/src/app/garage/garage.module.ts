import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageModule } from './home/home.module';
import { GarageSQLiteService } from './database/garagesqlite.service';
import { UserService } from './database/user.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomePageModule
  ],
  providers: [
    GarageSQLiteService,
    UserService
  ]
})
export class GarageModule { }
