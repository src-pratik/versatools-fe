import { Component, OnInit } from '@angular/core';
import { GarageSQLiteService } from '../garagesqlite.service';
import { saveAs } from 'file-saver'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
@Component({
  selector: 'app-garage-database-importexport',
  templateUrl: './importexport.component.html',
  styleUrls: ['./importexport.component.scss'],
  standalone: false
})
export class ImportexportComponent {

  constructor(private garageSQLiteService: GarageSQLiteService) { }

  async exportDatabase() {
    try {
      const json = await this.garageSQLiteService.toJsonFull();

      if (json)
        await Filesystem.writeFile({
          path: 'VersaTools/garagesqlite.json',
          data: json,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
          recursive: true
        });
      console.log('Database exported successfully.');
    } catch (error) {
      console.error('Export Database Error:', error);
    }
  }

  async importDatabase() {
    try {

      const data = await Filesystem.readFile({
        path: 'VersaTools/garagesqlite.json',
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      if (data.data)
      this.garageSQLiteService.fromJsonFull(data.data);
      console.log('Database imported successfully.');
    } catch (error) {
      console.error('Import Database Error:', error);
    }
  }

}
