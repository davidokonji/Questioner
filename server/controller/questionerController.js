import uuid from 'uuid';

import QuestionerModel from '../model/questioner';

class Questioner {
  static meetupMap(meetup, arrname) {
    meetup.map((meet) => {
      const meetups = {
        id: meet.id,
        title: meet.topic,
        location: meet.location,
        happeningOn: meet.happeningOn,
        tags: meet.tags,
      };
      return arrname.push(meetups);
    });
  }

  static validateEntry(body) {
    const arr = [];
    Object.keys(body).forEach((item) => {
      if (typeof body[item] === 'string') {
        const trimmed = body[item].trim();
        arr.push(trimmed);
      }
    });
    const newarr = arr.filter(val => val.length !== 0);
    if (newarr.length !== arr.length) {
      return false;
    }
    return true;
  }

  static createMeetup(req, res) {
    const check = Questioner.validateEntry(req.body);
    if (!check) {
      return res.status(400).send({
        status: 400,
        error: 'all required fields cannot be empty',
      });
    }
    const meetup = QuestionerModel.createMeetup(req.body);

    return res.status(201).send({
      status: 201,
      data: [
        {
          topic: meetup.topic,
          location: meetup.location,
          happeningOn: meetup.happeningOn,
          tags: meetup.tags,
        },
      ],
    });
  }

  static getMeetupById(req, res) {
    const meetups = QuestionerModel.getAllMeetUps();
    if (meetups.length === 0) {
      return res.status(200).send({
        status: 200,
        message: 'no meetup found',
      });
    }

    const meetup = QuestionerModel.getOneMeetup(req.params.id);

    if (!meetup) {
      return res.status(404).send({
        status: 404,
        error: 'Unable to find meetup with given ID',
      });
    }
    return res.status(200).send({
      status: 200,
      data: [
        {
          id: meetup.id,
          topic: meetup.topic,
          location: meetup.location,
          happeningOn: meetup.happeningOn,
          tags: meetup.tags,
        },
      ],
    });
  }

  static getMeetups(req, res) {
    const meetups = QuestionerModel.getAllMeetUps();

    const newMeetup = [];

    Questioner.meetupMap(meetups, newMeetup);

    if (meetups.length === 0) {
      return res.status(200).send({
        status: 200,
        message: 'no meetup created',
      });
    }

    return res.status(200).send({
      status: 200,
      data: newMeetup,
    });
  }

  static getUpcoming(req, res) {
    const meetups = QuestionerModel.getUpcomingMeetup();

    const newUpcoming = [];
    Questioner.meetupMap(meetups, newUpcoming);

    if (meetups.length === 0) {
      return res.status(200).send({
        status: 200,
        message: 'No Upcoming meetup',
      });
    }

    return res.status(200).send({
      status: 200,
      data: [
        newUpcoming,
      ],
    });
  }

  static createQuestion(req, res) {
    const check = Questioner.validateEntry(req.body);
    if (!check) {
      return res.status(400).send({
        status: 400,
        error: 'all required fields cannot be empty',
      });
    }
    const question = QuestionerModel.createQuestion(req.body);

    return res.status(201).send({
      status: 201,
      data: [
        {
          id: question.id,
          user: uuid.v4(),
          meetup: uuid.v4(),
          title: question.title,
          body: question.body,
        },
      ],
    });
  }

  static getQuestionById(req, res) {
    const meetup = QuestionerModel.getOneQuestion(req.params.id);

    if (!meetup) {
      return res.status(404).send({
        status: 404,
        error: 'unable to find question with given meetup ID',
      });
    }

    return res.status(200).send({
      status: 200,
      data: [
        {
          id: meetup.id,
          topic: meetup.title,
          body: meetup.body,
        },
      ],
    });
  }

  static patchQuestionvote(req, res) {
    const question = QuestionerModel.getOneQuestion(req.params.id);
    if (!question) {
      return res.status(404).send({
        status: 404,
        error: 'unable to find question with ID',
      });
    }
    const updateVote = QuestionerModel.updateVotes(req.params.id, req.body);

    return res.status(200).send({
      status: 200,
      data: [{
        meetup: uuid.v4(),
        title: updateVote.title,
        body: updateVote.body,
        votes: updateVote.votes,
      }],
    });
  }

  static createRSVP(req, res) {
    const meetup = QuestionerModel.getOneMeetup(req.params.id);
    if (!meetup) {
      return res.status(404).send({
        status: 404,
        error: 'unable to find meetup with ID',
      });
    }
    const rsvp = QuestionerModel.meetupRsvp(req.params.id, req.body);

    return res.status(201).send({
      status: 201,
      data: [{
        meetup: uuid.v4(),
        topic: meetup.topic,
        status: rsvp.response,
      }],
    });
  }
}

export default Questioner;
