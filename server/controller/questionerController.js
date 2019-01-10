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
      Validation.validQuestionfieldLength(res);
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
      Validation.validLengthResponse(res, 'topic', length);
    }
    const [validlocation, locationLength] = Validation.isValidLength(req.body.location, 10);
    if (!validlocation) {
      Validation.validLengthResponse(res, 'location', locationLength);
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
      Validation.verifyMeetupCount(res, 'meetup');
    }
    const meetup = QuestionerModel.getOneMeetup(req.params.id);

    if (!meetup) {
      Validation.validID(res, 'meetup');
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
      Validation.verifyMeetupCount(res, 'meetups');
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
      Validation.verifyMeetupCount(res, 'upcoming');
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
      Validation.validQuestionfieldLength(res);
    }
    const [validTitle, length] = Validation.isValidLength(req.body.title, 5);
    if (!validTitle) {
      Validation.validLengthResponse(res, 'question title', length);
    }
    const [validBody, bodyLength] = Validation.isValidLength(req.body.body, 10);
    if (!validBody) {
      Validation.validLengthResponse(res, 'question body', bodyLength);
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
      Validation.validID(res, ['question', req.params.id]);
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

  static patchQuestionUpvote(req, res) {
    const question = QuestionerModel.getOneQuestion(req.params.id);
    if (!question) {
      Validation.validID(res, ['question', req.params.id]);
    }

    const updateVote = QuestionerModel.updateUpVote(req.params.id, req.body);

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

  static patchQuestionDownvote(req, res) {
    const question = QuestionerModel.getOneQuestion(req.params.id);
    if (!question) {
      Validation.validID(res, ['question', req.params.id]);
    }

    const updateVote = QuestionerModel.updateDownVote(req.params.id, req.body);

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
      Validation.validID(res, ['meetup', req.params.id]);
    }
    const validResponse = Validation.validResponse(req.body.response);
    if (!validResponse) {
      return res.status(400).send({
        status: 400,
        error: `response value '${req.body.response}' is not valid  `,
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
