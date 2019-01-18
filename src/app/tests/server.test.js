import 'babel-polyfill';

import chai from 'chai';

import chaihttp from 'chai-http';

import app from '../index';

chai.use(chaihttp);

const expect = chai.expect;
chai.should();

let token = '';

beforeEach((done) => {
  chai.request(app)
    .post('/api/v1/auth/login')
    .send(
      {
        email: 'davidokonji3@gmail.com',
        password: 'password',
      },
    ).end((err, res) => {
      if (err) {
        return err;
      }
      token = res.body.data[0].token;
      return done();
    });
});

describe('POST /api/v1/auth/login', () => {
  it('should login a new user', (done) => {
    const user = {
      email: 'davidokonji3@gmail.com',
      password: 'password',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'davidokonji3@gmail.com',
        password: 'password',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body.data[0].user.email).to.be.equal(user.email);
        return done();
      });
  });
  it('should return 401 when invalid credentials passed', (done) => {
    const user = {
      email: 'nonsookonji1243@gmail.com',
      password: 'password',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user)
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
describe('POST /api/v1/auth/signup', () => {
  it('should return error if duplicate email entry', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji3@gmail.com',
        password: 'pass',
        phonenumber: '08109418943',
        username: 'devlen',
        isadmin: true,
      }).end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should create a new user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'david0okonji@gmail.com',
        password: 'pass',
        phonenumber: '08109418943',
        username: 'davidd',
        isadmin: true,
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        return done();
      });
  });
});

describe('POST /api/v1/meetups', () => {
  it('should create a meetups', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
        happeningOn: '2019-03-12',
        tags: ['hhh'],
      })
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        res.body.data[0].should.have.property('topic');
        res.body.data[0].should.have.property('location');
        res.body.data[0].should.have.property('tags');
        res.body.should.have.property('status').equal(201);
        return done();
      });
  });
  it('should return 400 if required fields are not sent', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        happeningOn: '2019-03-12',
      })
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(400);
        return done();
      });
  });
  it('should return 400 if happeningOn is a wrong format', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        happeningOn: '2019-03.12',
      })
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(400);
        return done();
      });
  });
  it('should return validation error 401 for invalid token passed', (done) => {
    const toks = 'jffjfjjhsbjhuywueyuirgriufbe';
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
        happeningOn: '2019-03-12',
      })
      .set('x-access-token', toks)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(401);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(401);
        return done();
      });
  });
});

describe('GET /api/v1/meetups/:id', () => {
  it('should return a meetup with the correct ID', (done) => {
    const id = '1';
    chai.request(app)
      .get(`/api/v1/meetups/${parseInt(id, 10)}`)
      .set('x-access-token', token)
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
    const id = 100;
    chai.request(app)
      .get(`/api/v1/meetups/${id}`)
      .set('x-access-token', token)
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
      .set('x-access-token', token)
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
      .set('x-access-token', token)
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
      .send({
        title: 'this is a valid question',
        body: 'this body cannot be empty',
      })
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(201);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(201);
        return done();
      });
  });
  it('should return 401 if no authorized token passed', (done) => {
    const toks = 'jffjfjjhsbjhuywueyuirgriufbe';
    chai.request(app)
      .post('/api/v1/questions')
      .send({
        title: 'this is a valid question',
        body: 'this body cannot be empty',
      })
      .set('x-access-token', toks)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(401);
        return done();
      });
  });
});
describe('POST /api/v1/comments/', () => {
  it('should post comment to question', (done) => {
    chai.request(app)
      .post('/api/v1/comments/')
      .set('x-access-token', token)
      .send({
        questionId: 1,
        comment: 'this is a valid comment',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(201);
        return done();
      });
  });
  it('return 400 if comment to sent correctly', (done) => {
    chai.request(app)
      .post('/api/v1/comments/')
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        return done();
      });
  });
});
describe('POST /api/v1/meetups/:id/rsvps', () => {
  it('should rsvp for a meetup', (done) => {
    const id = '1';
    chai.request(app)
      .post(`/api/v1/meetups/${id}/rsvps`)
      .set('x-access-token', token)
      .send({
        response: 'yes',
      })
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
    const id = parseInt(1, 10);
    chai.request(app)
      .patch(`/api/v1/questions/${id}/upvote`)
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(200);
        return done();
      });
  });
  it('should error if incorrect token passed to question', (done) => {
    const id = parseInt(1, 10);
    const toks = 'jffjfjjhsbjhuywueyuirgriufbe';
    chai.request(app)
      .patch(`/api/v1/questions/${id}/upvote`)
      .set('x-access-token', toks)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(401);
        return done();
      });
  });
});
describe('PATCH /api/v1/questions/:id/downvote', () => {
  it('should update the current upvote of question', (done) => {
    const id = parseInt(1, 10);
    chai.request(app)
      .patch(`/api/v1/questions/${id}/downvote`)
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(200);
        return done();
      });
  });
});
describe('POST /api/v1/meetups/:id/tags', () => {
  it('should post tags to a meetup', (done) => {
    const id = parseInt(1, 10);
    chai.request(app)
      .put(`/api/v1/meetups/${id}/tags`)
      .set('x-access-token', token)
      .send({
        tags: 'hello,world',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(200);
        return done();
      });
  });
});
