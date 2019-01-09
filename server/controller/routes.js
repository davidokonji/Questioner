import bodyParser from 'body-parser';

import express from 'express';

import Questioner from './questionerController';


const app = express();

app.use(bodyParser.json());

app.post('/api/v1/meetups', Questioner.createMeetup);

app.get('/api/v1/meetups/upcoming/', Questioner.getUpcoming);

app.get('/api/v1/meetups/:id', Questioner.getMeetupById);

app.get('/api/v1/meetups/', Questioner.getMeetups);

app.post('/api/v1/questions', Questioner.createQuestion);

app.get('/api/v1/questions/:id', Questioner.getQuestionById);

app.patch('/api/v1/questions/:id/upvote', Questioner.patchQuestionvote);

app.patch('/api/v1/questions/:id/downvote', Questioner.patchQuestionvote);

app.post('/api/v1/meetups/:id/rsvps', Questioner.createRSVP);

export default app;
