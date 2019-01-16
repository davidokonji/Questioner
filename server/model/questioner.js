import uuid from 'uuid';

class Questionermodel {
  constructor() {
    this.users = [];
    this.meetups = [];
    this.questions = [];
    this.rsvps = [];
    this.upcomings = [];
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
      images: data.images || [],
      topic: data.topic,
      happeningOn: new Date(data.happeningOn),
      tags: data.tags,
    };

    this.meetups.push(newMeetup);
    return newMeetup;
  }

  createQuestion(data) {
    const newQuestion = {
      id: uuid.v4(),
      createdOn: new Date(),
      createdBy: uuid.v4(),
      meetup: data.meetup,
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

  getUpcomingMeetups() {
    const meetups = this.getAllMeetUps();
    const upcomingMeetup = meetups.filter((meetup) => {
      const currentTimestamp = new Date().getTime();
      return meetup.happeningOn.getTime() >= currentTimestamp;
    });
    this.upcomings.push(upcomingMeetup);
    return upcomingMeetup;
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
    this.rsvps.push(newRsvp);

    return newRsvp;
  }

  updateUpVote(id) {
    const question = this.getOneQuestion(id);

    const index = this.questions.indexOf(question);
    this.questions[index].votes = question.votes + 1;
    return this.questions[index];
  }

  updateDownVote(id) {
    const question = this.getOneQuestion(id);

    const index = this.questions.indexOf(question);
    if (question.votes !== 0) {
      this.questions[index].votes = question.votes - 1;
    }

    return this.questions[index];
  }
}

export default new Questionermodel();
