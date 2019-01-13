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
    const getRequired = Validation.checkValidEntry(req.body, ['topic', 'location', 'happeningOn', 'tags']);
    const errorValues = getRequired.map(error => error);
    if (typeof getRequired === 'object' && getRequired.length > 0) {
      return res.status(400).send({
        status: 400,
        error: errorValues,
      });
    }
    const checkBody = Validation.validateEntry(req.body);
    if (!checkBody) {
      return Validation.validQuestionfieldLength(res);
    }
    const validateArray = Validation.validateArray(req.body.tags);
    if (!validateArray) {
      return res.status(400).send({
        status: 400,
        message: `tags, ${req.body.tags}  should be an array`,
      });
    }
    const validateArrayValues = Validation.validArrayValues(req.body.tags);
    if (!validateArrayValues) {
      return res.status(400).send({
        status: 400,
        message: `tags, ${req.body.tags} should have no empty values`,
      });
    }

    const [isValidDate, actualDate] = Validation.validateDate(req.body.happeningOn);

    if (!isValidDate) {
      return res.status(400).send({
        status: 400,
        error: `happeningOn value, ${actualDate} 
                should be a valid date format YYYY-MM-DD`,
      });
    }
    const checkpastDate = Validation.pastDate(req.body.happeningOn);
    if (!checkpastDate) {
      return res.status(400).send({
        status: 400,
        error: `happeningOn value, ${actualDate} should be after / on current date ${new Date().toLocaleDateString()}`,
      });
    }
    const [valid, length] = Validation.isValidLength(req.body.topic, 10);
    if (!valid) {
      return Validation.validLengthResponse(res, 'topic', length);
    }
    const [validlocation, locationLength] = Validation.isValidLength(req.body.location, 10);
    if (!validlocation) {
      return Validation.validLengthResponse(res, 'location', locationLength);
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
      return Validation.verifyMeetupCount(res, 'meetup');
    }
    const meetup = QuestionerModel.getOneMeetup(req.params.id);

    if (!meetup) {
      return res.status(404).send({
        status: 404,
        error: `unable to find meetup with given meetup ID "${req.params.id}"`,
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
      return Validation.verifyMeetupCount(res, 'meetups');
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
      return Validation.verifyMeetupCount(res, 'upcoming meetup');
    }

    return res.status(200).send({
      status: 200,
      data: [
        filteredFields,
      ],
    });
  }

  static createQuestion(req, res) {
    const getRequired = Validation.checkValidEntry(req.body, ['meetup', 'title', 'body']);
    const errorValues = getRequired.map(error => error);
    if (typeof getRequired === 'object' && getRequired.length > 0) {
      return res.status(400).send({
        status: 400,
        error: errorValues,
      });
    }
    const check = Validation.validateEntry(req.body);
    if (!check) {
      return Validation.validQuestionfieldLength(res);
    }
    const [validTitle, length] = Validation.isValidLength(req.body.title, 5);
    if (!validTitle) {
      return Validation.validLengthResponse(res, 'question title', length);
    }
    const [validBody, bodyLength] = Validation.isValidLength(req.body.body, 10);
    if (!validBody) {
      return Validation.validLengthResponse(res, 'question body', bodyLength);
    }
    const question = QuestionerModel.createQuestion(req.body);

    return res.status(201).send({
      status: 201,
      data: [
        {
          id: question.id,
          user: uuid.v4(),
          meetup: question.meetup,
          title: question.title,
          body: question.body,
        },
      ],
    });
  }

  static getQuestionById(req, res) {
    const meetup = QuestionerModel.getOneQuestion(req.params.id);

    if (!meetup) {
      return Validation.validID(res, ['question', req.params.id]);
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
      return Validation.validID(res, ['question', req.params.id]);
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
      return Validation.validID(res, ['question', req.params.id]);
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
    if (!req.body.response) {
      return res.status(400).send({
        status: 400,
        message: 'response is required',
      });
    }
    const meetup = QuestionerModel.getOneMeetup(req.params.id);
    if (!meetup) {
      return Validation.validID(res, ['meetup', req.params.id]);
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
        meetup: meetup.id,
        topic: meetup.topic,
        status: rsvp.response,
      }],
    });
  }
}

export default Questioner;
