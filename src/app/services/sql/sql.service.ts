import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { webDB } from './sql.web';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from "../../chat/services/logger/logger.service";

declare var window: any;
const DB_NAME = 'portal.db';
const DB_PATH = 'assets/portal.sql';

@Injectable({
  providedIn: 'root'
})
export class SQLService {

  db: any;
  private dbReady: BehaviorSubject<boolean>;

  constructor(
    public sqlite: SQLite, 
    private platform: Platform, 
    private http: HttpClient,
    private storage: Storage,
    private logger: LoggerService
    ) {
    this.init();
  }

  async asArray(data) {
    const list = [];
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        await list.push(data.rows.item(i));
      }
    }
    return await Promise.all(list);
  }

  async init() {
    this.dbReady = new BehaviorSubject(false);
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.logger.log('device');
      this.db = await this.sqlite.create({
        name: DB_NAME,
        location: 'default'
      });
    } else {
      this.logger.log('browser');
      const open = await window.openDatabase(DB_NAME, '1.0', 'Portal DB', 5 * 1024 * 1024);
      this.db = webDB(open);
    }
    await this.storage.get('db').then(status => {
      if (status) {
        this.dbReady.next(true);
      } else {
        this.importSQL(DB_PATH);
      }
    });
  }

  importSQL(path) {
    this.logger.log('SQL file imported');
    this.http.get(path, { responseType: 'text' })
      .subscribe(sql => {
        sql = sql.replace(/[\n\r]/gm,''); 
        const batch = sql.split(';');
        if(batch[batch.length-1] === ""){
          batch.pop();
        }
        this.logger.log(JSON.stringify(batch));
        this.db.sqlBatch(batch).then(() => {
          this.dbReady.next(true);
          this.storage.set('db', true);
        });
      });
  }

  getDbState() {
    return this.dbReady.asObservable();
  }
}
