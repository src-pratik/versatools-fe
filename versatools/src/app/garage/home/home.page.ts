import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GarageSQLiteService } from '../database/garagesqlite.service';
import { Echo } from '../plugin';


@Component({
  selector: 'app-garage-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  index: number = 0;
  output: string = 'Click Echo';

  constructor(private router: Router, private sql: GarageSQLiteService) { }

  navigateToSMSProcessing() {
    this.router.navigate(['/sms-processing']);
  }
  navigateToUserTest() {
    this.router.navigate(['/garage/user']);
  } navigateToImportExport() {
    this.router.navigate(['/garage/importexport']);
  }



  async echoButton() {
    this.index++;

    const { value } = await Echo.echo({ value: 'Hello World! ' + this.index });
    this.output = value;
    console.log('Response from native:', value);
  }
  async showError() {
    this.index++;

    const { value } = await Echo.echo({ value: 'showerror' });
    this.output = value;

  }

  async startDB() {
    this.output = 'Attempting to start database';
    try {
      await this.sql.initializeDatabase();
      this.output = 'Database started';
    } catch (error) {
      this.output = `Error on attempt to start database ${error}`;
    }

  }

  async startAndMigrateDB() {
    this.output = 'Attempting to start & migrate database';
    try {
      await this.sql.initializeDatabase(true);
      this.output = 'Database started';
    } catch (error) {
      this.output = `Error on attempt to start & migrate database ${error}`;
    }

  }

  async healthCheckDB() {
    this.output = 'Performing healthcheck on database';
    var result = await this.sql.performHealthCheck();
    this.output = `${result.status} : ${result.message}`
  }

  async closeDB() {
    this.output = 'Attempting to close connection';

    try {
      await this.sql.closeDatabase();
      this.output = 'Connection closed';
    } catch (error) {
      this.output = `Error on attempt to close connection ${error}`;
    }
  }
}
