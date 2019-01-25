
import bodyParser from 'body-parser';

import express from 'express';

import path from 'path';

import cors from 'cors';

import Auth from '../middleware/authenticate';

import Validation from '../validation/validation';

import Questioner from './questionerController';

import isadmin from '../middleware/isadmin';

import multerUploads from '../middleware/uploadfile';

import cloudinaryConfig from '../config/cloudinaryConfig';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/docs', express.static(path.join(__dirname, '../docs')));

app.use(bodyParser.json());

app.post('/api/v1/meetups', [cors(), Validation.createMeetup, Auth, isadmin], Questioner.createMeetup);

app.get('/api/v1/meetups/upcoming/', [cors(), Validation.GetUpcoming, Auth], Questioner.getUpcoming);

app.get('/api/v1/meetups/:id', [cors(), Validation.GetOneMeetup, Auth], Questioner.getMeetupById);

app.get('/api/v1/meetups/', [cors(), Validation.GetAllMeetups, Auth], Questioner.getMeetups);

app.post('/api/v1/questions', [cors(), Validation.CreateQuestion, Auth], Questioner.createQuestion);

app.post('/api/v1/comments', [cors(), Validation.postComments, Auth], Questioner.postComments);

app.patch('/api/v1/questions/:id/upvote', [cors(), Auth], Questioner.patchQuestionUpvote);

app.patch('/api/v1/questions/:id/downvote', [cors(), Validation.patchDownvote, Auth], Questioner.patchQuestionDownvote);

app.get('/api/v1/questions/:id', cors(), Questioner.getQuestionById);

app.post('/api/v1/meetups/:id/rsvps', [cors(), Validation.createRsvp, Auth], Questioner.createRSVP);

app.post('/api/v1/auth/signup', [cors(), Validation.createUser], Questioner.createUser);

app.post('/api/v1/auth/login', [cors(), Validation.loginUser], Questioner.loginUser);

app.delete('/api/v1/meetups/:id', [cors(), Validation.deleteMeetup, Auth, isadmin], Questioner.deleteMeetup);

app.post('/api/v1/meetups/:id/tags', [cors(), Auth, isadmin], Questioner.postTags);

app.post('/api/v1/meetups/:id/images', [cors(), cloudinaryConfig, multerUploads.multerUploads, Auth, isadmin], Questioner.postImages);

app.use('/home', (req, res) => {
  return res.status(200).json({
    status: 200,
    message: 'welcome to  Questioner, refer to api docs',
  });
});
app.use('*', (req, res) => {
  return res.status(404).json({
    status: 404,
    error: 'invalid route passed',
  });
});

export default app;
