import uuid from 'uuid';

import QuestionerModel from '../model/questioner';

function meetupMap(meetup, arrname) {
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
const Questioner = {
  createMeetup(req, res) {
    if (!req.body.id && !req.body.location
        && !req.body.topic && !req.body.happeningOn && !req.body.tags) {
      return res.status(400).send({
        status: 400,
        message: 'All required fields cannot be empty',
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
  },

  getMeetupById(req, res) {
    const meetups = QuestionerModel.getAllMeetUps();
    if (meetups.length === 0) {
      return res.status(200).send({
        status: 200,
        message: 'no meetup created',
      });
    }

    const meetup = QuestionerModel.getOneMeetup(req.params.id);

    if (!meetup) {
      return res.status(404).send({
        status: 404,
        message: 'Unable to find meetup with given ID',
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
  },

  getMeetups(req, res) {
    const meetup = QuestionerModel.getAllMeetUps();

    const newMeetup = [];

    meetupMap(meetup, newMeetup);

    if (meetup.length === 0) {
      return res.status(200).send({
        status: 200,
        message: 'no meetup created',
      });
    }

    return res.status(200).send({
      status: 200,
      data: newMeetup,
    });
  },

  getUpcoming(req, res) {
    const meetups = QuestionerModel.getUpcomingMeetup();

    const newUpcoming = [];
    meetupMap(meetups, newUpcoming);

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
  },

  createQuestion(req, res) {
    if (!req.body.title && !req.body.body) {
      return res.status(400).send({
        status: 400,
        message: 'All required fields cannot be empty',
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
  },
  patchQuestionvote(req, res) {
    const question = QuestionerModel.getOneQuestion(req.params.id);
    if (!question) {
      return res.status(404).send({
        status: 404,
        message: 'Unable to find question with ID',
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
  },

  createRSVP(req, res) {
    const meetup = QuestionerModel.getOneMeetup(req.params.id);
    if (!meetup) {
      return res.status(404).send({
        status: 404,
        message: 'Unable to find meetup with ID',
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
  },
};

export default Questioner;
