import express from 'express';

import Questioner from './controller/questionerController';

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.post('/api/v1/meetups', Questioner.createMeetup);

app.get('/api/v1/meetups/upcoming/', Questioner.getUpcoming);

app.get('/api/v1/meetups/:id', Questioner.getMeetupById);

app.get('/api/v1/meetups/', Questioner.getMeetups);

app.post('/api/v1/questions', Questioner.createQuestion);

app.patch('/api/v1/questions/:id/upvote', Questioner.patchQuestionUpvote);

app.patch('/api/v1/questions/:id/downvote', Questioner.patchQuestionDownvote);

app.post('/api/v1/meetups/:id/rsvps', Questioner.createRSVP);

app.listen(port);

export default app;
