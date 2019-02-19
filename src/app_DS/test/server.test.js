import 'babel-polyfill';

import chai from 'chai';

import chaihttp from 'chai-http';

import uuid from 'uuid';

import app from '../server';

import QuestionerModel from '../model/questioner';

chai.use(chaihttp);

const expect = chai.expect;
chai.should();

const test = [{
  createdOn: new Date(),
  location: 'Lagos Nigeria',
  images: [],
  topic: 'meetup topic 1',
  happeningOn: new Date('2019-12-01'),
  tags: ['cool', 'nice'],
},
{
  title: 'question title',
  body: 'question body note',
  votes: 1,
  meetup: 1,
}, {
  createdOn: new Date(),
  location: '  ',
  images: [],
  topic: '     ',
  happeningOn: new Date('2019-12-01'),
  tags: ['cool', 'nice'],
}];

describe('POST /api/v1/meetups', () => {
  it('should post data to meetups', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send(test[0])
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(201);
        expect(res.body.data[0].topic).to.be.equal(test[0].topic);
        expect(res.body.data[0].location).to.be.equal(test[0].location);
        res.body.should.have.property('status').equal(201);
        return done();
      });
  });
  it('should return 400 if fields are empty', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send(test[2])
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        return done();
      });
  });
});

describe('GET /api/v1/meetups/:id', () => {
  it('should return a meetup with the correct ID', (done) => {
    const testdata = QuestionerModel.createMeetup(test[0]);
    chai.request(app)
      .get(`/api/v1/meetups/${testdata.id}`)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(200);
        return done();
      });
  });
  it('should return 404 if ID is not found', (done) => {
    const id = uuid.v4();
    chai.request(app)
      .get(`/api/v1/meetups/${id}`)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(404);
        return done();
      });
  });
});

describe('GET /api/v1/meetups/', () => {
  it('should return all the available meetups', (done) => {
    chai.request(app)
      .get('/api/v1/meetups/')
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(200);
        expect(res).to.be.a('object');
        return done();
      });
  });
});

describe('GET /api/v1/meetups/upcoming', () => {
  it('should return all the upcoming meetups', (done) => {
    chai.request(app)
      .get('/api/v1/meetups/upcoming')
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        if (res.body.status === 404) {
          expect(res).to.be.status(404);
          return done();
        }
        expect(res).to.be.status(200);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(200);
        return done();
      });
  });
});

describe('POST /api/v1/questions', () => {
  it('should post a question to a meetup', (done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .send(test[1])
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(201);
        return done();
      });
  });
});

describe('PATCH /api/v1/questions/:id/upvote', () => {
  it('should update the current upvote of question', (done) => {
    const testdata = QuestionerModel.createQuestion(test[1]);
    chai.request(app)
      .patch(`/api/v1/questions/${testdata.id}/upvote`)
      .send({
        votes: 2,
      })
      .end((err, res) => {
        expect(res).to.be.status(200);
        done();
      });
  });
});

describe('PATCH /api/v1/questions/:id/downvote', () => {
  it('should update the current upvote of question', (done) => {
    const testdata = QuestionerModel.createQuestion(test[1]);
    chai.request(app)
      .patch(`/api/v1/questions/${testdata.id}/downvote`)
      .send({
        votes: 1,
      })
      .end((err, res) => {
        expect(res).to.be.status(200);
        done();
      });
  });
});

describe('POST /api/v1/meetups/:id/rsvps', () => {
  it('should set up a RSVP for a meetup', (done) => {
    const testdata = QuestionerModel.createMeetup(test[0]);
    chai.request(app)
      .post(`/api/v1/meetups/${testdata.id}/rsvps`)
      .send({
        response: 'yes',
      })
      .end((err, res) => {
        expect(res).to.be.status(201);
        done();
      });
  });
});
