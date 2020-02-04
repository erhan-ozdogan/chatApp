import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { webDB } from './sql.web';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import { LoggerService } from "../logger/logger.service";

declare var window: any;
const DB_NAME = 'afadApp.db';
const DB_PATH = 'assets/seed.sql';

export interface message{
  to:string,
  from:string,
  createdAt:number,
  message:string
}

@Injectable({
  providedIn: 'root'
})
export class SQLService {

  db: any;
  private dbReady: BehaviorSubject<boolean>;
  messages=new BehaviorSubject([]);

  constructor(
    public sqlite: SQLite, 
    private platform: Platform, 
    private http: HttpClient,
    private storage: Storage,
    private logger:LoggerService,
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
    await this.storage.get('dbMessages').then(status => {
      if (status) {
        this.logger.log("Database :"+status)
        this.dbReady.next(true);
      } else {
        this.logger.log("Database :"+status)
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
          this.storage.set('dbMessages', true);
        });
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
  getMessages():Observable<message[]>{
    return this.messages.asObservable();
  }
  loadMessages(to,from){
    this.logger.log("Mesajlar Alındı.");
    try {
      return this.db.executeSql('SELECT * FROM messages2 WHERE (mto= ? and mfrom= ?) or (mto= ? and mfrom=?) ORDER BY createdAt ASC ',[to,from,from,to]).then(data => {
        let messages:message[]=[];
        if(data.rows.length>0){
          for(let i=0; i<data.rows.length;i++){
            messages.push({
              to:data.rows.item(i).mto,
              from:data.rows.item(i).mfrom,
              createdAt:data.rows.item(i).createdAt,
              message:data.rows.item(i).mmessage,            
            });
          }
        }
        this.logger.log("Alınan Mesaj Adedi:"+messages.length);
        this.messages.next(messages);
      })
      
    } catch (error) {
      this.logger.log(error);
      
    }
  }
  addMessage(msg:message){
    let sql="INSERT INTO messages2 VALUES(?,?,?,?);"
    this.db.executeSql(sql,[msg.to,msg.from,msg.message,msg.createdAt]).then(res=>{
      this.logger.log("Mesaj Eklendi");
    },error=>{this.logger.log(error)})
  }
  removeMessage(msg:message){
    let sql="DELETE FROM messages2 WHERE mto=? and mfrom=? and createdAt=?";
    this.db.executeSql(sql,[msg.to,msg.from,msg.createdAt]).then(res=>{
    },error=>{this.logger.log(error)})
  }
  updateMessage(msg:message,message=null){
    if(message==null){
      message=msg.message;
    }
    let sql="UPDATE messages2 SET mmessage=? WHERE mto=? and mfrom=? and createdAt=?";
    this.db.executeSql(sql,[message,msg.to,msg.from,msg.createdAt]).then(res=>{
    },error=>{this.logger.log(error)})
  }
  async syncDb(messages:message[],user){
    let sql="DELETE FROM messages2 WHERE mto=? and mfrom!=?"; 
    this.db.executeSql(sql,[user,user,]).then(res=>{
      messages.forEach(message => {
        let sql="INSERT INTO messages2 VALUES(?,?,?,?)";
        this.db.executeSql(sql,[message.to,message.from,message.message,message.createdAt]);
      });
    })
  }

}
