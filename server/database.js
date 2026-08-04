import {db} from "./server.js";
export async function createTables(db){
    await db.query(`create table if not exists users(
        userId int primary key auto_increment not null,
        username varchar(255) default null,
        password varchar(255) default null,
        created_at timestamp default current_timestamp)
    `);

    await db.query(`create table if not exists pdf_files(
        id int primary key auto_increment not null,
        filename varchar(255) default null,
        userid int default null,
        pdf_data longblob not null,
        created_at timestamp default current_timestamp,
        foreign key(userid) references users(userId) on delete cascade)
    `);

    await db.query(`create table if not exists chat_session(
        id int primary key auto_increment not null,
        user_id int default null,
        session_name varchar(255) default null,
        created_at timestamp default current_timestamp,
        foreign key(user_id) references users(userId) on delete cascade)
    `);

    await db.query(`create table if not exists chat_messages(
        id int primary  key auto_increment,
session_id int not null,
question text not null,
answer longtext not null,
created_at timestamp default current_timestamp,
foreign key(session_id) references chat_session(id) on delete cascade
    )`);
}