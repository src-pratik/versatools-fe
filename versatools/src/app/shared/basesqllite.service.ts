import { SQLiteDBConnection, SQLiteConnection, CapacitorSQLite } from '@capacitor-community/sqlite';

export class BaseSQLiteService {
  protected sqliteConnection: SQLiteConnection;
  protected db: SQLiteDBConnection | null = null;
  protected dbName: string;
  protected dbVersion: number;
  protected dbReadOnly: boolean = false;

  constructor(dbName: string, dbVersion: number, sqliteConnection: SQLiteConnection) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.sqliteConnection = sqliteConnection;
  }

  // Initialization and Connection Management
  async initializeDatabase(migrate: boolean = false): Promise<void> {
    try {
      console.info('Initializing database...');
      const connectionConsistency = (await this.sqliteConnection.checkConnectionsConsistency()).result;
      const isConnectionAvailable = (await this.sqliteConnection.isConnection(this.dbName, this.dbReadOnly)).result;

      if (connectionConsistency && isConnectionAvailable) {
        this.db = await this.sqliteConnection.retrieveConnection(this.dbName, this.dbReadOnly);
        console.info('Retrieved existing database connection.');
      } else {
        this.db = await this.sqliteConnection.createConnection(this.dbName, false, 'no-encryption', this.dbVersion, this.dbReadOnly);
        console.info('Created new database connection.');
      }

      if (this.db) {
        await this.db.open();
        console.info('Opened database connection.');
        if (migrate)
          await this.applyMigrations();
      }
    } catch (error) {
      console.error('SQLite Initialization Error:', error);
      throw error;
    }
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.close();
      await this.sqliteConnection.closeConnection(this.dbName, this.dbReadOnly);
      console.info('Closed database connection.');
    }
  }

  async performHealthCheck(): Promise<{ status: boolean; message: string }> {
    try {
      if (!this.db) {
        console.warn('Database connection is not initialized.');
        return { status: false, message: 'Database connection is not initialized' };
      }

      const result = await this.db.query(`SELECT 1 AS test;`);
      if (result.values !== undefined && result?.values.length > 0) {
        console.info('Database is accessible.');
        return { status: true, message: 'Database is accessible' };
      }
      console.warn('Database query failed.');
      return { status: false, message: 'Database query failed' };
    } catch (error) {
      console.error('Health Check Error:', error);
      return { status: false, message: `Health check failed: ${error}` };
    }
  }

  // CRUD Operations
  async addRecord(table: string, data: { [key: string]: any }): Promise<void> {
    if (!this.db) throw new Error('Database is not initialized');

    const columns = Object.keys(data).filter((key) => data[key] !== undefined);
    const values = columns.map((key) => data[key]);
    const placeholders = columns.map(() => '?').join(',');

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders});`;
    console.info(`Executing query: ${query} with values: ${values}`);
    await this.db.run(query, values);
  }

  async modifyRecord(table: string, data: { [key: string]: any }, condition: string, conditionValues: any[]): Promise<void> {
    if (!this.db) throw new Error('Database is not initialized');

    const updateFields = Object.keys(data)
      .filter((key) => data[key] !== undefined)
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.keys(data).filter((key) => data[key] !== undefined).map((key) => data[key]);
    const query = `UPDATE ${table} SET ${updateFields} WHERE ${condition};`;
    console.info(`Executing query: ${query} with values: ${[...values, ...conditionValues]}`);
    await this.db.run(query, [...values, ...conditionValues]);
  }

  async fetchRecords(table: string, condition: string = '', conditionValues: any[] = []): Promise<any[]> {
    if (!this.db) throw new Error('Database is not initialized');

    const query = condition ? `SELECT * FROM ${table} WHERE ${condition};` : `SELECT * FROM ${table};`;
    console.info(`Executing query: ${query} with values: ${conditionValues}`);
    const result = await this.db.query(query, conditionValues);

    return result.values || [];
  }

  async removeRecord(table: string, condition: string, conditionValues: any[]): Promise<void> {
    if (!this.db) throw new Error('Database is not initialized');

    const query = `DELETE FROM ${table} WHERE ${condition};`;
    console.info(`Executing query: ${query} with values: ${conditionValues}`);
    await this.db.run(query, conditionValues);
  }

  // Database Version and Migration Management
  public async fetchCurrentDatabaseVersion(): Promise<number> {
    if (!this.db) return 0;
    const result = await this.db.query(`PRAGMA user_version;`);
    console.info(`Fetched current database version: ${result.values?.[0]?.user_version || 0}`);
    return result.values?.[0]?.user_version || 0;
  }

  protected async applyMigrations(): Promise<void> {
    const currentVersion = await this.fetchCurrentDatabaseVersion();
    if (currentVersion >= this.dbVersion) return;

    console.info(`Upgrading DB from v${currentVersion} to v${this.dbVersion}`);

    for (let version = currentVersion + 1; version <= this.dbVersion; version++) {
      const migrations = this.getMigrationScripts(version);
      if (migrations) {
        console.info(`Applying Migration v${version}`);
        for (const query of migrations) {
          console.info(`Executing migration query: ${query}`);
          await this.runQuery(query);
        }
      }
    }

    await this.runQuery(`PRAGMA user_version = ${this.dbVersion};`);
    console.info(`Database migrated to v${this.dbVersion}`);
  }

  protected getMigrationScripts(version: number): string[] | null {
    // To be implemented in child classes
    return null;
  }

  // General Query Execution
  async runQuery(query: string, parameters: any[] = []): Promise<void> {
    if (this.db) {
      console.info(`Executing query: ${query} with parameters: ${parameters}`);
      await this.db.run(query, parameters);
    }
  }

  // Export and Import Operations
  async toJsonFull(): Promise<string | null> {
    if (!this.db) {
      console.error('Database is not initialized');
      return null;
    }
    const json = await CapacitorSQLite.exportToJson({ database: this.dbName, encrypted: false, jsonexportmode: 'full', readonly: this.dbReadOnly });
    console.info('Database exported to JSON');
    return JSON.stringify(json.export);
  }

  async fromJsonFull(dataString: any): Promise<void> {
    if (!this.db) {
      console.error('Database is not initialized');
      return;
    }
    if (typeof dataString !== 'string') {
      console.error('Provided JSON is not a string');
      return;
    }
    try {
      await CapacitorSQLite.importFromJson({
        jsonstring: dataString
      });
      console.info('Database imported from JSON', dataString);
    } catch (error) {
      console.error('Error importing JSON:', error);
    }
  }
}
