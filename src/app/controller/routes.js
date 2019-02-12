
import bodyParser from 'body-parser';

import express from 'express';

import cors from 'cors';

import swaggerUi from 'swagger-ui-express';

import Auth from '../middleware/authenticate';

import Validation from '../validation/validation';

import Questioner from './questionerController';

import isadmin from '../middleware/isadmin';

import multerUploads from '../middleware/uploadfile';

import cloudinaryConfig from '../config/cloudinaryConfig';

import * as swagerDocument from '../docs/questioner.json';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options('*', cors());

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swagerDocument));

app.post('/api/v1/meetups', [cors(), Auth, isadmin, cloudinaryConfig, multerUploads.multerUploads, Validation.createMeetup], Questioner.createMeetup);

app.get('/api/v1/meetups/upcoming/', [cors(), Auth, Validation.GetUpcoming], Questioner.getUpcoming);

app.get('/api/v1/meetups/:id', [cors(), Auth, Validation.GetOneMeetup], Questioner.getMeetupById);

app.get('/api/v1/meetups/', [cors(), Auth, Validation.GetAllMeetups], Questioner.getMeetups);

app.post('/api/v1/questions', [cors(), Auth, Validation.CreateQuestion], Questioner.createQuestion);

app.post('/api/v1/comments', [cors(), Auth, Validation.postComments], Questioner.postComments);

app.patch('/api/v1/questions/:id/upvote', [cors(), Auth, Validation.patchDownvote], Questioner.patchQuestionUpvote);

app.patch('/api/v1/questions/:id/downvote', [cors(), Auth, Validation.patchDownvote], Questioner.patchQuestionDownvote);

app.get('/api/v1/meetups/:id/questions', [cors(), Auth, Validation.getQuestions], Questioner.getQuestions);

app.post('/api/v1/meetups/:id/rsvps', [cors(), Auth, Validation.createRsvp], Questioner.createRSVP);

app.post('/api/v1/auth/signup', [cors(), Validation.createUser], Questioner.createUser);

app.post('/api/v1/auth/login', [cors(), Validation.loginUser], Questioner.loginUser);

app.delete('/api/v1/meetups/:id', [cors(), Auth, isadmin, Validation.deleteMeetup], Questioner.deleteMeetup);

app.post('/api/v1/meetups/:id/tags', [cors(), Auth, isadmin], Questioner.postTags);

app.post('/api/v1/meetups/:id/images', [cors(), Auth, isadmin, cloudinaryConfig, multerUploads.multerUploads], Questioner.postImages);

app.get('/', (req, res) => {
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
