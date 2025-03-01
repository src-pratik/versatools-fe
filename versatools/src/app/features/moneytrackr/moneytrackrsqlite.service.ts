import { Injectable } from '@angular/core';
import { SQLiteConnection } from '@capacitor-community/sqlite';
import { script as migrationv1 } from './dbmigrations/migrationv1';
import { AbstractSQLiteService } from 'src/app/shared/sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class MoneyTrackrDatabaseService extends AbstractSQLiteService {

  constructor(sqliteConnection: SQLiteConnection) {
    super('versatools_moneytrackr', 1, sqliteConnection);
  }
  protected override getMigrationScripts(version: number): string[] | null {
    const migrationScripts: { [key: number]: string[] } = {
      1: migrationv1
    }
    return migrationScripts[version] || null;
  }
  async initWebStore(): Promise<void> {
    try {
      await this.sqliteConnection.initWebStore();
    } catch (err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`initWebStore: ${err}`);
    }
  }

}
