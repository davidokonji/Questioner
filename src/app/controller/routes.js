
import bodyParser from 'body-parser';

import express from 'express';

import Auth from '../middleware/authenticate';

import Validation from '../validation/validation';

import Questioner from './questionerController';

import isadmin from '../middleware/isadmin';

import upload from '../middleware/uploadfile';

const app = express();

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

app.post('/api/v1/meetups', [upload.single('images'), Validation.createMeetup, Auth, isadmin], Questioner.createMeetup);

app.get('/api/v1/meetups/upcoming/', [Validation.GetUpcoming, Auth], Questioner.getUpcoming);

app.get('/api/v1/meetups/:id', [Validation.GetOneMeetup, Auth], Questioner.getMeetupById);

app.get('/api/v1/meetups/', [Validation.GetAllMeetups, Auth], Questioner.getMeetups);

app.post('/api/v1/questions', [Validation.CreateQuestion, Auth], Questioner.createQuestion);

app.post('/api/v1/comments', [Validation.postComments, Auth], Questioner.postComments);

app.patch('/api/v1/questions/:id/upvote', [Auth], Questioner.patchQuestionUpvote);

app.patch('/api/v1/questions/:id/downvote', [Validation.patchDownvote, Auth], Questioner.patchQuestionDownvote);

app.get('/api/v1/questions/:id', Questioner.getQuestionById);

app.post('/api/v1/meetups/:id/rsvps', [Validation.createRsvp, Auth], Questioner.createRSVP);

app.post('/api/v1/auth/signup', [Validation.createUser], Questioner.createUser);

app.post('/api/v1/auth/login', Questioner.loginUser);

app.delete('/api/v1/meetups/:id', [Validation.deleteMeetup, Auth, isadmin], Questioner.deleteMeetup);

app.put('/api/v1/meetups/:id/tags', [Auth, isadmin], Questioner.postTags);

app.put('/api/v1/meetups/:id/images', [upload.single('images'), Auth, isadmin], Questioner.postImages);

app.use('*', (req, res) => {
  return res.status(404).send({
    status: 404,
    error: 'invalid route passed',
  });
});
app.use((err, req, res, next) => {
  res.status(400).send({
    status: 400,
    message: 'invalid response sent',
  });
  return next();
});
app.use('/', (req, res) => {
  res.send(200).json({
    status: 200,
    message: 'welcome to  Questioner, refer to api docs',
  });
});


export default app;
