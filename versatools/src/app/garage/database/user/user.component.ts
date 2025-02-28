import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-garage-database-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: false
})
export class UserTestComponent implements OnInit {
  users: User[] = [];
  newUser: User = { name: '', email: '', phone: '' };

  constructor(private userService: UserService) { }

  async ngOnInit() {
    await this.loadUsers();
  }

  async addUser() {
    if (!this.newUser.name || !this.newUser.email) {
      alert('Name and Email are required!');
      return;
    }
    await this.userService.addUser(this.newUser);
    this.newUser = { name: '', email: '', phone: '' };
    await this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.userService.getAllUsers();
  }

  async deleteUser(userId: number) {
    await this.userService.deleteUser(userId);
    await this.loadUsers();
  }
}
