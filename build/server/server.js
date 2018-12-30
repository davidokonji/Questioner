'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _questionerController = require('./controller/questionerController');

var _questionerController2 = _interopRequireDefault(_questionerController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_express2.default.json());

var port = 3000;

app.post('/api/v1/meetups', _questionerController2.default.createMeetup);

app.get('/api/v1/meetups/upcoming/', _questionerController2.default.getUpcoming);

app.get('/api/v1/meetups/:id', _questionerController2.default.getMeetupById);

app.get('/api/v1/meetups/', _questionerController2.default.getMeetups);

app.post('/api/v1/questions', _questionerController2.default.createQuestion);

// app.get('/api/v1/questions/:id', Questioner.getQuestionById);

app.patch('/api/v1/questions/:id/upvote', _questionerController2.default.patchQuestionUpvote);

app.patch('/api/v1/questions/:id/downvote', _questionerController2.default.patchQuestionDownvote);

app.post('/api/v1/meetups/:id/rsvps', _questionerController2.default.createRSVP);

app.listen(port);

exports.default = app;