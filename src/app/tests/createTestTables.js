import bcrypt from 'bcrypt';

import dotenv from 'dotenv';

import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTIONSTRING,
});

const adminPass = bcrypt.hashSync('password', 10);
const userPass = bcrypt.hashSync('password', 10);

const createTables = async () => {
  try {
    const text = `
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(191) NOT NULL,
            lastname VARCHAR(191) NOT NULL,
            othername VARCHAR(191) NOT NULL,
            email VARCHAR(191) UNIQUE NOT NULL,
            password VARCHAR(191) NOT NULL,
            phonenumber VARCHAR(20) NOT NULL,
            username VARCHAR(191) UNIQUE NOT NULL,
            isadmin BOOLEAN DEFAULT FALSE,
            registered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS meetup(
            id SERIAL PRIMARY KEY,
            topic VARCHAR(255) NOT NULL,
            location TEXT NOT NULL,
            happeningon TIMESTAMP NOT NULL,
            images TEXT[],
            tags TEXT[],
            createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS question(
            id SERIAL PRIMARY KEY,
            createdOn TIMESTAMPTZ DEFAULT NOW(),
            createdBy INT NOT NULL,
            meetupId INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            vote INT,
            FOREIGN KEY (createdBy) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (meetupId) REFERENCES meetup (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS rsvp(
            id SERIAL,
            meetupId INT NOT NULL,
            userId INT NOT NULL,
            response text NOT NULL,
            PRIMARY KEY(meetupId, userId),
            FOREIGN KEY (meetupId) REFERENCES meetup (id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE);

            CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
            questionId INT NOT NULL,
            comment TEXT NOT NULL,
            userid INT NOT NULL,
            createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (questionId) REFERENCES question (id) ON DELETE CASCADE);
            
            CREATE TABLE IF NOT EXISTS votes(
            id SERIAL PRIMARY KEY,
            userId INT NOT NULL,
            questionId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (questionId) REFERENCES question (id) ON DELETE CASCADE);

            INSERT INTO users (firstname, lastname, othername, email, password, phoneNumber,username, isadmin)
            VALUES ('Nonso', 'Okonji', 'David', 'davidokonji3@gmail.com', '${adminPass}', '08109418943', 'devlen', TRUE);

            INSERT INTO users (firstname, lastname, othername, email, password, phoneNumber,username, isadmin)
            VALUES ('David', 'Okonji', 'nonso', 'nonsookonjoooi@gmail.com', '${userPass}', '08109418943', 'nonso', TRUE);

            INSERT INTO users (firstname, lastname, othername, email, password, phoneNumber,username, isadmin)
            VALUES ('onyeka', 'Okonji', 'rhema', 'rhema@gmail.com', '${userPass}', '08109418943', 'dexter', TRUE);

            INSERT INTO users (firstname, lastname, othername, email, password, phoneNumber,username, isadmin)
            VALUES ('David', 'Okonji', 'nonso', 'nonsookonjooo1@gmail.com', '${userPass}', '08109418943', 'nonsoo', TRUE);

            INSERT INTO meetup (topic,location,happeningon,tags) 
            VALUES ('this is a test meetup','lagos nigeria','2019-03-12', ARRAY['tags','tag2'] );

            INSERT INTO meetup (topic,location,happeningon,tags) 
            VALUES ('this is a test meetup2','kwara nigeria','2019-04-12', ARRAY['tags1','tag2'] );

            INSERT INTO meetup (topic,location,happeningon,tags) 
            VALUES ('','unique nigeria','2019-05-12', ARRAY['tech','fun'] );

            INSERT INTO question (createdby, meetupid, title, body, vote)
            VALUES (1, 1, 'this is a question from migration', 'question test test', 2);

            INSERT INTO question (createdby, meetupid, title, body, vote)
            VALUES (1, 2, 'this is a question from migration', 'question test test', 3);

            INSERT INTO question (createdby, meetupid, title, body, vote)
            VALUES (1, 1, 'this is a question from migration', 'question test test', 4);
            
            INSERT INTO question (createdby, meetupid, title, body, vote)
            VALUES (1, 2, 'this is a question from migration', 'question test test', 5);

            INSERT INTO comments (questionid, comment, userid)
            VALUES (1, 'this is a comment from migration', 2);

            INSERT INTO comments (questionid, comment, userid)
            VALUES (2, 'this is a comment from migration', 1);
        `;

    const response = await pool.query(text);
    return await response;
  } catch (error) {
    return 'unable to migrate data';
  }
};

createTables();
