import uuid from 'uuid';

import QuestionerModel from '../model/questioner';

import Validation from './validation';

class Questioner {
  static getRequiredFields(meetups, filtered) {
    meetups.map((meet) => {
      const meetup = {
        id: meet.id,
        title: meet.topic,
        location: meet.location,
        happeningOn: meet.happeningOn,
        tags: meet.tags,
      };
      return filtered.push(meetup);
    });
  }

  static createMeetup(req, res) {
    const checkBody = Validation.validateEntry(req.body);
    if (!checkBody) {
      return res.status(400).send({
        status: 400,
        error: 'fill all required fields',
      });
    }
    const [correctDate, actualDate] = Validation.validateDate(req.body.happeningOn);

    if (!correctDate) {
      return res.status(400).send({
        status: 400,
        error: `happeningOn value ${actualDate} should be in a valid date format YYYY-MM-DD`,
      });
    }
    const [valid, length] = Validation.isValidLength(req.body.topic, 10);
    if (!valid) {
      return res.status(400).send({
        status: 400,
        error: `topic should have minimum length of ${length}`,
      });
    }
    const [validlocation, locationLength] = Validation.isValidLength(req.body.location, 10);
    if (!validlocation) {
      return res.status(400).send({
        status: 400,
        error: `location should have minimun length of ${locationLength}`,
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
        error: `unable to find meetup with ID ${req.params.id}`,
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

    const filteredFields = [];

    Questioner.getRequiredFields(meetups, filteredFields);

    if (meetups.length === 0) {
      return res.status(200).send({
        status: 200,
        message: 'no meetups found',
      });
    }

    return res.status(200).send({
      status: 200,
      data: filteredFields,
    });
  }

  static getUpcoming(req, res) {
    const meetups = QuestionerModel.getUpcomingMeetups();

    const filteredFields = [];
    Questioner.getRequiredFields(meetups, filteredFields);

    if (meetups.length === 0) {
      return res.status(200).send({
        status: 200,
        message: 'no upcoming meetups',
      });
    }

    return res.status(200).send({
      status: 200,
      data: [
        filteredFields,
      ],
    });
  }

  static createQuestion(req, res) {
    const check = Validation.validateEntry(req.body);
    if (!check) {
      return res.status(400).send({
        status: 400,
        error: 'fill all required fields',
      });
    }
    const [validTitle, length] = Validation.isValidLength(req.body.title, 10);
    if (!validTitle) {
      return res.status(400).send({
        status: 400,
        error: `Question title should have minimun length of ${length}`,
      });
    }
    const [validBody, bodyLength] = Validation.isValidLength(req.body.body, 15);
    if (!validBody) {
      return res.status(400).send({
        status: 400,
        error: `Question Body should have minimun length of ${bodyLength}`,
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
    const updateVote = QuestionerModel.updateVote(req.params.id, req.body);

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
