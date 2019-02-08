
import bodyParser from 'body-parser';

import express from 'express';

// import cors from 'cors';

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
// app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swagerDocument));

app.post('/api/v1/meetups', [cloudinaryConfig, multerUploads.multerUploads, Validation.createMeetup, Auth, isadmin], Questioner.createMeetup);

app.get('/api/v1/meetups/upcoming/', [Validation.GetUpcoming, Auth], Questioner.getUpcoming);

app.get('/api/v1/meetups/:id', [Validation.GetOneMeetup, Auth], Questioner.getMeetupById);

app.get('/api/v1/meetups/', [Validation.GetAllMeetups, Auth], Questioner.getMeetups);

app.post('/api/v1/questions', [Validation.CreateQuestion, Auth], Questioner.createQuestion);

app.post('/api/v1/comments', [Validation.postComments, Auth], Questioner.postComments);

app.patch('/api/v1/questions/:id/upvote', [Validation.patchDownvote, Auth], Questioner.patchQuestionUpvote);

app.patch('/api/v1/questions/:id/downvote', [Validation.patchDownvote, Auth], Questioner.patchQuestionDownvote);

// app.get('/api/v1/questions/:id', Questioner.getQuestionById);

app.post('/api/v1/meetups/:id/rsvps', [Validation.createRsvp, Auth], Questioner.createRSVP);

app.post('/api/v1/auth/signup', [Validation.createUser], Questioner.createUser);

app.post('/api/v1/auth/login', [Validation.loginUser], Questioner.loginUser);

app.delete('/api/v1/meetups/:id', [Validation.deleteMeetup, Auth, isadmin], Questioner.deleteMeetup);

app.post('/api/v1/meetups/:id/tags', [Auth, isadmin], Questioner.postTags);

app.post('/api/v1/meetups/:id/images', [cloudinaryConfig, multerUploads.multerUploads, Auth, isadmin], Questioner.postImages);

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
