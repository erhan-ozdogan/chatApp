import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';

export interface message{
  chatId:number,
  to:number,
  from:number,
  date:Date,
  message:string
}

export interface user{
  username:string,
  name:string,
  password:string,
  surname:string,
  phone:string,
  
}
export interface chat{
  chatId:number,
  userId1:number,
  userId2:number
}

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  private database:SQLiteObject;
  private dbReady:BehaviorSubject<boolean> = new BehaviorSubject(false);

  users=new BehaviorSubject([]);

  constructor(private sqlite:SQLite,private plt:Platform,private sqlitePorter:SQLitePorter,private http:HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name:'afadApp.db',
        location:'default'
      })
      .then((db:SQLiteObject) => {
        this.database=db;
        this.seedDatabase();
      });
    });
   }
   seedDatabase(){
     this.http.get('assets/seed.sql',{responseType:'text'})
     .subscribe(sql =>{
       this.sqlitePorter.importSqlToDb(this.database,sql)
       .then(_ => {
         this.loadUsers();
         this.dbReady.next(true);
       })
       .catch(e => console.log(e));
     });
   }
   getDatabaseState(){
     return this.dbReady.asObservable();
   }
   getUsers():Observable<user[]>{
     return this.users.asObservable();
   }
  loadUsers(){
    return this.database.executeSql('SELECT * FROM user',[]).then(data => {
      let users:user[]=[];
      if(data.rows.length>0){
        for(let i=0; i<data.rows.length;i++){
          users.push({
            username:data.rows.item(i).username,
            name:data.rows.item(i).name,
            surname:data.rows.item(i).surname,
            phone:data.rows.item(i).phone,
            password:data.rows.item(i).password,
            
          });
        }
      }
      this.users.next(users);
    })
  }



  
}
