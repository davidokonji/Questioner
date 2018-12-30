import uuid from 'uuid';

class Questioner {
  constructor() {
    this.users = [];
    this.meetups = [];
    this.questions = [];
    this.rsvp = [];
    this.upcoming = [];
  }

  createUser(data) {
    const newUser = {
      id: uuid.v4(),
      firstname: data.firstname,
      lastname: data.lastname,
      othername: data.othername,
      email: data.email,
      phoneNumber: data.phoneNumber,
      username: data.username,
      registered: new Date(),
      isAdmin: data.isAdmin,
    };

    this.users.push(newUser);

    return newUser;
  }

  getUsers() {
    return this.users;
  }

  createMeetup(data) {
    const newMeetup = {
      id: uuid.v4(),
      createdOn: new Date(),
      location: data.location,
      images: [data.images] || [],
      topic: data.topic,
      happeningOn: new Date(data.happeningOn),
      tags: [data.tags],
    };

    this.meetups.push(newMeetup);
    return newMeetup;
  }

  createQuestion(data) {
    const newQuestion = {
      id: uuid.v4(),
      createdOn: new Date(),
      createdBy: uuid.v4(),
      meetup: uuid.v4(),
      title: data.title,
      body: data.body,
      votes: data.votes || 0,
    };

    this.questions.push(newQuestion);
    return newQuestion;
  }

  getOneQuestion(id) {
    return this.questions.find(question => question.id === id);
  }

  getOneMeetup(id) {
    return this.meetups.find(meetup => meetup.id === id);
  }

  getAllMeetUps() {
    return this.meetups;
  }

  getUpcomingMeetup() {
    const meetups = this.getAllMeetUps();
    const upmeetups = meetups.filter((meetup) => {
      const current = new Date().getTime();
      return meetup.happeningOn.getTime() >= current;
    });
    this.upcoming.push(upmeetups);
    return upmeetups;
  }

  getOneUser(id) {
    return this.users.find(user => user.id === id);
  }

  meetupRsvp(id, data) {
    const meetup = this.getOneMeetup(id);

    const newRsvp = {
      id: uuid.v4(),
      meetup: meetup.id,
      user: uuid.v4(),
      response: data.response,
    };

    this.rsvp.push(newRsvp);

    return newRsvp;
  }

  updateUpVotes(id, data) {
    const question = this.getOneQuestion(id);

    const index = this.questions.indexOf(question);

    this.questions[index].votes = data.votes || question.vote;

    return this.questions[index];
  }

  updateDownVotes(id, data) {
    const question = this.getOneQuestion(id);

    const index = this.questions.indexOf(question);

    this.questions[index].votes = data.votes || question.vote;

    return this.questions[index];
  }
}

export default new Questioner();
