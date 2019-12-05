import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from "../authentication/authentication.service";

export interface message{
  to:string,
  from:string,
  createdAt:number,
  message:string
}

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  private database:SQLiteObject;
  private dbReady:BehaviorSubject<boolean> = new BehaviorSubject(false);

  messages=new BehaviorSubject([]);

  constructor(private sqlite:SQLite,private plt:Platform,private sqlitePorter:SQLitePorter,private http:HttpClient,private auth:AuthenticationService) {
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
         //this.loadMessages(to,from);
         this.dbReady.next(true);
       })
       .catch(e => console.log(e));
     });
   }
   getDatabaseState(){
     return this.dbReady.asObservable();
   }
   getMessages():Observable<message[]>{
     return this.messages.asObservable();
   }
  loadMessages(to,from){
    return this.database.executeSql('SELECT * FROM messages2 WHERE (mto= ? and mfrom= ?) or (mto= ? and mfrom=?) ',[to,from,from,to]).then(data => {
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
      this.messages.next(messages);
    })
  }
  addMessage(msg:message){
    let sql="INSERT INTO messages2 VALUES(?,?,?,?);"
    this.database.executeSql(sql,[msg.to,msg.from,msg.message,msg.createdAt]).then(res=>{
      console.log("Mesaj Eklendi");
    },error=>{console.log(error)})
  }



  
}
