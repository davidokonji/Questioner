import bcrypt from 'bcrypt';

import db from '../config/db';

const adminPass = bcrypt.hashSync('passowrd', 10);

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
            happeningon DATE NOT NULL,
            images VARCHAR(150),
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
            FOREIGN KEY (createdBy) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (meetupId) REFERENCES meetup (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS rsvp(
            id SERIAL,
            meetupId INT NOT NULL,
            userId INT NOT NULL,
            response text NOT NULL,
            PRIMARY KEY(meetupId, userId),
            FOREIGN KEY (userId) REFERENCES meetup (id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE);

            CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
            meetupId INT NOT NULL,
            questionId INT NOT NULL,
            comment TEXT NOT NULL,
            userId INT NOT NULL,
            createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (meetupId) REFERENCES meetup (id) ON DELETE CASCADE,
            FOREIGN KEY (questionId) REFERENCES question (id) ON DELETE CASCADE);
            
            CREATE TABLE IF NOT EXISTS votes(
            id SERIAL PRIMARY KEY,
            userId INT NOT NULL,
            questionId INT NOT NULL,
            vote VARCHAR(8) NOT NULL,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (questionId) REFERENCES question (id) ON DELETE CASCADE);

            INSERT INTO users (firstname, lastname, othername, email, password, phoneNumber,username, isAdmin)
            VALUES ('Nonso', 'Okonji', 'David', 'davidokonji3@gmail.com', '${adminPass}', '08109418943', 'devlen', true);
        `;

    const query = await db.query(text);
    return query;
  } catch (error) {
    return error;
  }
};

createTables();
