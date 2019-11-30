/*CREATE TABLE IF NOT EXISTS user(btAddress TEXT PRIMARY KEY,username TEXT,name TEXT,surname TEXT,phone TEXT,loginInfo BOOLEAN);
INSERT or IGNORE INTO user VALUES('33:11:aa:bb:cc:00',"us1",'ad1','soyad1','25069220111','FALSE');
INSERT or IGNORE INTO user VALUES("33:11:aa:bb:cc:01","us2","ad2","soyad2","5069220112","FALSE");
INSERT or IGNORE INTO user VALUES("33:11:aa:bb:cc:02","us3","ad3","soyad3","5069220113","FALSE");
INSERT or IGNORE INTO user VALUES("33:11:aa:bb:cc:03","us4","ad4","soyad4","5069220114","FALSE");*/

CREATE TABLE IF NOT EXISTS messages2(mto TEXT,mfrom TEXT, mmessage TEXT, createdAt INTEGER);
