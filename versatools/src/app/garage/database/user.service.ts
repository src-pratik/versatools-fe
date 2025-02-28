import { Injectable } from '@angular/core';
import { User } from './user.model';
import { GarageSQLiteService } from './garagesqlite.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tableName = 'users';

  constructor(private sqliteDataService: GarageSQLiteService) {}

  async addUser(user: User): Promise<void> {
    await this.sqliteDataService.addRecord(this.tableName, user);
  }

  async updateUser(userId: number, user: Partial<User>): Promise<void> {
    await this.sqliteDataService.modifyRecord(this.tableName, user, 'id = ?', [userId]);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.sqliteDataService.fetchRecords(this.tableName);
  }

  async getUserById(userId: number): Promise<User | null> {
    const users = await this.sqliteDataService.fetchRecords(this.tableName, 'id = ?', [userId]);
    return users.length ? users[0] : null;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.sqliteDataService.removeRecord(this.tableName, 'id = ?', [userId]);
  }
}
