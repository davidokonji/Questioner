import 'babel-polyfill';

import chai from 'chai';

import chaihttp from 'chai-http';

import path from 'path';

import request from 'supertest';

import app from '../index';

chai.use(chaihttp);

const expect = chai.expect;
chai.should();

let token = '';
let testToken = '';
before((done) => {
  chai.request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'davidokonji3@gmail.com',
      password: 'password',
    }).end((err, res) => {
      if (err) {
        return err;
      }
      token = res.body.data[0].token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjEsImlzYWRtaW4iOnRydWUsImlhdCI6MTU0ODEwODMzOSwiZXhwIjoxNTQ4MjgxMTM5fQ.A9ecXU0Fsmi2JPJC7WfPBAH52NygDA4IBt8N-8XmtWE';
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
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        expect(res.body.data[0].user.email).to.be.equal(user.email);
        return done();
      });
  });
  it('should return 404 when invalid credentials passed', (done) => {
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
        expect(res).to.have.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 404 when correct email but wrong password passed', (done) => {
    const user = {
      email: 'davidokonji3@gmail.com',
      password: 'password12',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 invalid email sent', (done) => {
    const user = {
      email: 'nonsookonjigmail.com',
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
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 when email is not sent', (done) => {
    const user = {
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
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 when password is not sent', (done) => {
    const user = {
      email: 'nonsookonji3@gmail.com',
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
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 invalid email', (done) => {
    const user = {
      email: 'nonsookonjigmail.com',
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
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('POST /api/v1/auth/signup', () => {
  it('should create a new user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji2018@gmail.com',
        password: 'password',
        phonenumber: '08109418943',
        username: 'davidd',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(201);
        expect(res).to.not.have.property('message');
        expect(res).to.be.a('object');
        return done();
      });
  });
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
        res.body.should.have.property('message');
        expect(res).to.be.a('object');
        return done();
      });
  });

  it('should return error if username already exist', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji2018@gmail.com',
        password: 'pass',
        phonenumber: '08109418943',
        username: 'devlen',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        res.body.should.have.property('message');
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return error if username is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji2018@gmail.com',
        password: 'password',
        phonenumber: '08109418943',
        username: 'devlen@$%',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return error if username is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji2018@gmail.com',
        password: 'password',
        phonenumber: '08109418943',
        username: 'devlen okonji',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return error if firstname not sent', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji2018@gmail.com',
        password: 'pass',
        phonenumber: '08109418943',
        username: 'devlen111',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });

  it('should return error if lastname not sent', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        othername: 'nonso',
        email: 'davidokonji2018@gmail.com',
        password: 'pass',
        phonenumber: '08109418943',
        username: 'devlen2222',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return error if othername not sent', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        email: 'davidokonji2018@gmail.com',
        password: 'password',
        phonenumber: '08109418943',
        username: 'devlen2222',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });

  it('should return error if username not sent', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji2018@gmail.com',
        password: 'pass',
        phonenumber: '08109418943',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });

  it('should return error if email not sent', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        password: 'password',
        phonenumber: '08109418943',
        username: 'devlen123',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return error invalid email not sent', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji gmail.com',
        password: 'password123',
        phonenumber: '08109418943',
        username: 'devlenlove',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });

  it('should return error if invalid password length sent', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji2022@gmail.com',
        password: 'pass',
        phonenumber: '08109418943',
        username: 'devlen2018',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });

  it('should return error if password not sent', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'david',
        lastname: 'okonji',
        othername: 'nonso',
        email: 'davidokonji2018@gmail.com',
        phonenumber: '08109418943',
        username: 'devlen',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
});

describe('POST /api/v1/meetups', () => {
  let userToken = '';
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'davidokonji2018@gmail.com',
        password: 'password',
      }).end((err, res) => {
        if (err) {
          return err;
        }
        userToken = res.body.data[0].token || '';
        return done();
      });
  });
  it('should return 401 if a non admin tries to create meetups', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
        happeningOn: '2019-03-12',
        tags: 'hhh',
      })
      .set('x-access-token', userToken)
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
  it('should create meetups', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
        happeningOn: '2019-03-12',
        tags: 'hhh',
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
  it('should create meetups with images', (done) => {
    const images = path.join(__dirname, './test.jpg');
    chai.request(app)
      .post('/api/v1/meetups')
      .set('x-access-token', token)
      .set('Content-Type', 'multipart/form-data')
      .field('topic', 'this is a correct meetup')
      .field('location', 'lagos nigeria')
      .field('happeningOn', '2019-03-12')
      .field('tags', 'hhh')
      .attach('images', images)
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
  it('should 400 if invalid images sent', (done) => {
    const images = path.join(__dirname, './test.mp4');
    chai.request(app)
      .post('/api/v1/meetups')
      .set('x-access-token', token)
      .set('Content-Type', 'multipart/form-data')
      .field('topic', 'this is a correct meetup')
      .field('location', 'lagos nigeria')
      .field('happeningOn', '2019-03-12')
      .field('tags', 'hhh')
      .attach('images', images)
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
  it('should return 400 if meetup has a past date', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
        happeningOn: '2018-03-12',
        tags: 'hhh',
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
  it('should return 401 when no token passed', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
        happeningOn: '2019-03-12',
        tags: 'hhh',
      })
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
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjEsImlzYWRtaW4iOnRydWUsImlhdCI6MTU0ODEwODMzOSwiZXhwIjoxNTQ4MjgxMTM5fQ.A9ecXU0Fsmi2JPJC7WfPBAH52NygDA4IBt8N-8XmtWE';
  it('should return 401 when expired token passed', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
        happeningOn: '2019-03-12',
        tags: 'hhh',
      })
      .set('x-access-token', expiredToken)
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
  it('should return 400 if location is not sent', (done) => {
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
  it('should return 400 if topic is not sent', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        location: 'lagos nigeria',
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
  it('should return 400 if topic is not a valid length', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this',
        location: 'lagos nigeria',
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
  it('should return 400 if happeningOn is not sent', (done) => {
    chai.request(app)
      .post('/api/v1/meetups')
      .send({
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
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
        topic: 'this is a correct meetup',
        location: 'lagos nigeria',
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
        res.body.should.have.property('message');
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
  it('should return 401 if invalid token sent', (done) => {
    const toks = 'jffjfjjhsbjhuywueyuirgriufbe';
    const id = '1';
    chai.request(app)
      .get(`/api/v1/meetups/${parseInt(id, 10)}`)
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
  it('should return 401 when invalid token passed', (done) => {
    const toks = 'jffjfjjhsbjhuywueyuirgriufbe';
    chai.request(app)
      .get('/api/v1/meetups/')
      .set('x-access-token', toks)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(401);
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
  it('should return 401 if invalid token passed', (done) => {
    const toks = 'jffjfjjhsbjhuywueyuirgriufbe';
    chai.request(app)
      .get('/api/v1/meetups/upcoming')
      .set('x-access-token', toks)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(401);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(401);
        return done();
      });
  });
});

describe('POST /api/v1/questions', () => {
  it('should post a question to a meetup', (done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .send({
        meetupId: 2,
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
  it('should return 400 if title not provided', (done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .send({
        body: 'this body cannot be empty',
      })
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(400);
        return done();
      });
  });
  it('should return 400 if title not of valid length', (done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .send({
        title: 'the',
        body: 'this body cannot be empty',
      })
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(400);
        return done();
      });
  });
  it('should return 400 if body not provided', (done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .send({
        title: 'this is a valid question',
      })
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(400);
        return done();
      });
  });
  it('should return 400 if body not of valid length', (done) => {
    chai.request(app)
      .post('/api/v1/questions')
      .send({
        title: 'this is a valid question',
        body: 'this',
      })
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(400);
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
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('GET /api/v1/meetups/:id/questions', () => {
  it('should get questions relating to a meetup', (done) => {
    const id = '2';
    chai.request(app)
      .get(`/api/v1/meetups/${id}/questions`)
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
  it('should return 404 if ID is not found', (done) => {
    const id = 100;
    chai.request(app)
      .get(`/api/v1/meetups/${id}/questions`)
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
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 404 if question ID does not exist', (done) => {
    chai.request(app)
      .post('/api/v1/comments/')
      .set('x-access-token', token)
      .send({
        questionId: 10,
        comment: 'this is a valid comment',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 if question ID not provided', (done) => {
    chai.request(app)
      .post('/api/v1/comments/')
      .set('x-access-token', token)
      .send({
        comment: 'this is a valid comment',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 if invalid comment passed', (done) => {
    chai.request(app)
      .post('/api/v1/comments/')
      .set('x-access-token', token)
      .send({
        questionId: 1,
        comment: '1$',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 if comment not provided', (done) => {
    chai.request(app)
      .post('/api/v1/comments/')
      .set('x-access-token', token)
      .send({
        questionId: 1,
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('POST /api/v1/meetups/:id/rsvps', () => {
  it('should rsvp for a meetup', (done) => {
    const id = '2';
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
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should 400 for wrong rsvp response', (done) => {
    const id = '1';
    chai.request(app)
      .post(`/api/v1/meetups/${id}/rsvps`)
      .set('x-access-token', token)
      .send({
        response: 12,
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should 400 for wrong rsvp response length', (done) => {
    const id = '1';
    chai.request(app)
      .post(`/api/v1/meetups/${id}/rsvps`)
      .set('x-access-token', token)
      .send({
        response: 'this is a wrong response',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should 400 for wrong rsvp not provided', (done) => {
    const id = '1';
    chai.request(app)
      .post(`/api/v1/meetups/${id}/rsvps`)
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should 404 for invalid meetup id for rsvp ', (done) => {
    const id = '10';
    chai.request(app)
      .post(`/api/v1/meetups/${id}/rsvps`)
      .set('x-access-token', token)
      .send({
        response: 'this is a wrong response',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('PATCH /api/v1/questions/:id/upvote', () => {
  it('should update the current upvote of question', (done) => {
    const id = parseInt(2, 10);
    chai.request(app)
      .patch(`/api/v1/questions/${id}/upvote`)
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
  it('should return 404 if invalid question ID passed', (done) => {
    const id = parseInt(10, 10);
    chai.request(app)
      .patch(`/api/v1/questions/${id}/upvote`)
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
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
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('PATCH /api/v1/questions/:id/downvote', () => {
  it('should downvote the current vote of question', (done) => {
    const id = parseInt(2, 10);
    chai.request(app)
      .patch(`/api/v1/questions/${id}/downvote`)
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
  it('should return 404 if invalid question ID passed', (done) => {
    const id = parseInt(10, 10);
    chai.request(app)
      .patch(`/api/v1/questions/${id}/downvote`)
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should not downvite if vote equals 0', (done) => {
    const id = parseInt(4, 10);
    chai.request(app)
      .patch(`/api/v1/questions/${id}/downvote`)
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
describe('POST /api/v1/meetups/:id/tags', () => {
  it('should post tags to a meetup', (done) => {
    const id = parseInt(1, 10);
    chai.request(app)
      .post(`/api/v1/meetups/${id}/tags`)
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
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 if meetup not found', (done) => {
    const id = parseInt(10, 10);
    chai.request(app)
      .post(`/api/v1/meetups/${id}/tags`)
      .set('x-access-token', token)
      .send({
        tags: 'hello,world',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 401 for unauthorized access to post tags', (done) => {
    const toks = 'jffjfjjhsbjhuywueyuirgriufbe';
    const id = parseInt(1, 10);
    request(app)
      .post(`/api/v1/meetups/${id}/tags`)
      .set('x-access-token', toks)
      .send({
        tags: 'hello,world',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(401);
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('POST /api/v1/meetups/:id/images', () => {
  let images = path.join(__dirname, './test.jpg');
  it('should post image to a meetup', (done) => {
    const id = parseInt(1, 10);
    chai.request(app)
      .post(`/api/v1/meetups/${id}/images`)
      .set('x-access-token', token)
      .attach('images', images)
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
  it('should return 401 for unauthorized access to post images', (done) => {
    const toks = 'jffjfjjhsbjhuywueyuirgriufbe';
    const id = parseInt(1, 10);
    request(app)
      .post(`/api/v1/meetups/${id}/images`)
      .set('x-access-token', toks)
      .attach('images', images)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(401);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 for invalid images type sent', (done) => {
    images = path.join(__dirname, './test.mp4');
    const id = parseInt(1, 10);
    request(app)
      .post(`/api/v1/meetups/${id}/images`)
      .set('x-access-token', token)
      .attach('images', images)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('Check for invalid route passed', () => {
  it('should return 404 when invalid route passed', (done) => {
    chai.request(app)
      .get('/api/')
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 200 when default route passed', (done) => {
    chai.request(app)
      .get('/')
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
describe('DELETE /api/v1/meetups/:id', () => {
  it('should delete a meetup', (done) => {
    chai.request(app)
      .del('/api/v1/meetups/1')
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
  it('should return 404 if meetup no found', (done) => {
    const id = parseInt(10, 10);
    chai.request(app)
      .del(`/api/v1/meetups/${id}`)
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 404 if meetup does not exist', (done) => {
    const id = parseInt(1, 10);
    chai.request(app)
      .del(`/api/v1/meetups/${id}`)
      .set('x-access-token', token)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('GET /api/v1/user/', () => {
  it('should get a single user using id from token', (done) => {
    chai.request(app)
      .get('/api/v1/user/')
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
before((done) => {
  chai.request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'rhema@gmail.com',
      password: 'password',
    }).end((err, res) => {
      if (err) {
        return err;
      }
      testToken = res.body.data[0].token || '';
      return done();
    });
});
describe('GET /api/v1/user/upcomingmeetups', () => {
  it('should get all upcoming meetups user rsvp', (done) => {
    chai.request(app)
      .get('/api/v1/user/upcomingmeetups')
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
  it('should return 404 if user has no upcoming meetup', (done) => {
    chai.request(app)
      .get('/api/v1/user/upcomingmeetups')
      .set('x-access-token', testToken)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('GET /api/v1/user/questions', () => {
  it('should get the count of questions posted by user', (done) => {
    chai.request(app)
      .get('/api/v1/user/questions')
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
  it('should return 404 for no questions posted by user', (done) => {
    chai.request(app)
      .get('/api/v1/user/questions')
      .set('x-access-token', testToken)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
});
describe('GET /api/v1/user/questions/comments', () => {
  it('should get the count of comments posted by user', (done) => {
    chai.request(app)
      .get('/api/v1/user/questions/comments')
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
describe('GET /api/v1/meetups/rsvp/topquestions', () => {
  it('should get the top questions feed for meetups user rsvped', (done) => {
    chai.request(app)
      .get('/api/v1/meetups/rsvp/topquestions')
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
  it('should return 404 if user has not rsvp for any meetup', (done) => {
    chai.request(app)
      .get('/api/v1/meetups/rsvp/topquestions')
      .set('x-access-token', testToken)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.be.status(404);
        expect(res).to.be.a('object');
        return done();
      });
  });
});

describe('POST /api/v1/user/edit', () => {
  it('should edit a user detail with profile image', (done) => {
    const images = path.join(__dirname, './test.jpg');
    chai.request(app)
      .post('/api/v1/user/edit')
      .set('x-access-token', token)
      .set('Content-Type', 'multipart/form-data')
      .field('username', 'devlen0')
      .field('about', 'i am a software engineer')
      .attach('images', images)
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(200);
        return done();
      });
  });
  it('should get 400 when invalid image type uploaded', (done) => {
    const images = path.join(__dirname, './test.mp4');
    chai.request(app)
      .post('/api/v1/user/edit')
      .set('x-access-token', token)
      .set('Content-Type', 'multipart/form-data')
      .field('username', 'devlen0')
      .field('about', 'i am a software engineer')
      .attach('images', images)
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
  it('should edit a user detail without profile image', (done) => {
    chai.request(app)
      .post('/api/v1/user/edit')
      .set('x-access-token', token)
      .set('Content-Type', 'multipart/form-data')
      .field('username', 'devlen0')
      .field('about', 'i am a software engineer')
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        res.body.should.have.property('status').equal(200);
        return done();
      });
  });
  it('should return 400 when invalid username sent', (done) => {
    chai.request(app)
      .post('/api/v1/user/edit')
      .set('x-access-token', token)
      .set('Content-Type', 'multipart/form-data')
      .field('username', 'devlen0*')
      .field('about', 'i am a software engineer')
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
  it('should return 400 when invalid username sent', (done) => {
    chai.request(app)
      .post('/api/v1/user/edit')
      .set('x-access-token', token)
      .set('Content-Type', 'multipart/form-data')
      .field('username', 'devlen0')
      .field('about', 'i am a software engineer*')
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
});
describe('POST /api/v1/user/edit/password', () => {
  it('should edit user password', (done) => {
    chai.request(app)
      .post('/api/v1/user/edit/password')
      .set('x-access-token', token)
      .send({
        password: 'password',
        confirmpassword: 'password',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        return done();
      });
  });
  it('should return 400 if passwords do not match', (done) => {
    chai.request(app)
      .post('/api/v1/user/edit/password')
      .set('x-access-token', token)
      .send({
        password: 'password',
        confirmpassword: 'pass',
      })
      .end((err, res) => {
        if (err) {
          expect(res).to.throw(err);
          return done(err);
        }
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        return done();
      });
  });
});
