export const webDB = (db: any) => {
    return {
      executeSql: (sql: any) => {
        return new Promise((resolve, reject) => {
          db.transaction((tx: any) => {
            // tslint:disable-next-line: no-shadowed-variable
            tx.executeSql(sql, [], (tx: any, rs: any) => {
              resolve(rs);
            });
          });
        });
      },
      sqlBatch: (sqlArray: any) => {
        return new Promise((resolve, reject) => {
          const batch = [];
          db.transaction((tx: any) => {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < sqlArray.length; i++) {
              // tslint:disable-next-line: no-shadowed-variable
              batch.push(new Promise((resolve, reject) => {
                tx.executeSql(sqlArray[i], [], () => { resolve(true); });
              }));
              Promise.all(batch).then(() => resolve(true));
            }
          });
        });
      }
    };
  };
