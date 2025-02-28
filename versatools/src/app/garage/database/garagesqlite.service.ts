import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { BaseSQLiteService } from 'src/app/shared/basesqllite.service';

@Injectable({
  providedIn: 'root',
})
export class GarageSQLiteService extends BaseSQLiteService {
  constructor() {
    super('versatools_garage', 3, new SQLiteConnection(CapacitorSQLite));
  }

  protected override getMigrationScripts(version: number): string[] | null {
    const migrationScripts: { [key: number]: string[] } = {
      1: [
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        );`
      ],
      2: [
        `ALTER TABLE users ADD COLUMN phone TEXT;`,
        `CREATE INDEX idx_users_email ON users(email);`
      ],
      3: [
        `CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );`,
        `ALTER TABLE users ADD COLUMN last_login TEXT;`
      ]
    };
    return migrationScripts[version] || null;
  }
}
