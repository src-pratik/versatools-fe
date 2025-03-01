import { Injectable } from '@angular/core';
import { SQLiteConnection } from '@capacitor-community/sqlite';
import { script as migrationv1 } from './dbmigrations/migrationv1';
import { AbstractSQLiteService } from 'src/app/shared/sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class MoneyTrackrDatabaseSetupService extends AbstractSQLiteService {

  constructor(sqliteConnection: SQLiteConnection) {
    super('versatools_moneytrackr', 1, sqliteConnection);
  }
  protected override getMigrationScripts(version: number): string[] | null {
    const migrationScripts: { [key: number]: string[] } = {
      1: migrationv1
    }
    return migrationScripts[version] || null;
  }
}
