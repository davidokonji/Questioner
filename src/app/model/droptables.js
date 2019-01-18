import db from '../config/db';

const droptables = async () => {
  const text = `
              DROP TABLE IF EXISTS users CASCADE;
              DROP TABLE IF EXISTS meetup CASCADE;
              DROP TABLE IF EXISTS question CASCADE;
              DROP TABLE IF EXISTS rsvp CASCADE;
              DROP TABLE IF EXISTS comments CASCADE;
              DROP TABLE IF EXISTS votes CASCADE;
            `;
  const query = await db.query(text).catch((error) => {
    return error;
  });
  return query;
};

droptables();
