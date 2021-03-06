import cloudinary from 'cloudinary';

import moment from 'moment';

import db from '../config/db';

import jwt from '../middleware/jwtToken';

import hash from '../middleware/hashPassword';

import dataUri from '../middleware/uploadfile';

import Helper from '../helpers/controllerHelper';

class Questioner {
  /**
   * getRequiredfields method
   * @param {object} meetups
   * @param {object} filtered
   * @returns {array} filtered fields
   */
  static getRequiredFields(meetups, filtered) {
    meetups.map((meet) => {
      const meetup = {
        id: meet.id,
        title: meet.topic,
        location: meet.location,
        happeningOn: meet.happeningon,
        tags: meet.tags,
        images: meet.images,
      };
      return filtered.push(meetup);
    });
  }
  /**
   *  creating a new user
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */

  static async createUser(req, res) {
    const hashedPassword = hash.hashPassword(req.body.password, 10);
    const text = `INSERT INTO 
                  users(firstname,lastname,othername,email,password,phonenumber,username,isadmin) 
                  VALUES
                  ($1,$2,$3,$4,$5,$6,$7,$8)
                  RETURNING *`;
    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.othername,
      req.body.email.toLowerCase(),
      hashedPassword,
      req.body.phonenumber,
      req.body.username,
      req.body.isadmin || false,
    ];
    const { rows } = await db.query(text, values);
    const token = await jwt.generateJwtToken(rows[0].id, rows[0].isadmin);
    return res.status(201).json({
      status: 201,
      token,
      data: [{
        user: {
          id: rows[0].id,
          firstname: rows[0].firstname,
          lastname: rows[0].lastname,
          othername: rows[0].othername,
          email: rows[0].email,
          phonenumber: rows[0].phonenumber,
          username: rows[0].username,
          registered: rows[0].registered,
        },
      }],
    });
  }

  /**
   * Get a user by id
   * @param {object} req
   * @param {object} res
   */
  static async getSingleUser(req, res) {
    const text = 'SELECT * FROM users where id = $1';
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200).json({
      status: 200,
      data: [{
        id: rows[0].id,
        firstname: rows[0].firstname,
        lastname: rows[0].lastname,
        othername: rows[0].othername,
        email: rows[0].email,
        phonenumber: rows[0].phonenumber,
        username: rows[0].username,
        images: rows[0].images,
        about: rows[0].about,
      }],
    });
  }

  /**
   * Get question count for user
   * @param {Object} req
   * @param {Object} res
   */
  static async getQuestionCount(req, res) {
    const text = 'SELECT * FROM question WHERE createdby = $1 order by vote desc';
    const { rows, rowCount } = await db.query(text, [req.user.id]);
    if (rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'user has posted no question',
      });
    }
    return res.status(200).json({
      status: 200,
      questionCount: rowCount,
      data: rows,
    });
  }

  /**
   * Get questions commented on by user
   * @param {object} req
   * @param {object} res
   */
  static async getQuestionCommentCount(req, res) {
    const text = `select count (*) from comments as c
    right join question as q on c.questionid = q.id where c.userid = $1`;
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200).json({
      status: 200,
      commentCount: rows[0].count,
    });
  }

  /**
   *  Login user
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */

  static async loginUser(req, res) {
    const text = 'SELECT * FROM users WHERE email = $1 ';
    const values = [
      req.body.email.toLowerCase(),
    ];
    const { rows } = await db.query(text, values);
    const matchedPassword = hash.verifyPassword(req.body.password, rows[0].password);
    if (!matchedPassword) {
      return res.status(404).json({
        status: 404,
        message: 'invalid credential',
      });
    }
    const token = await jwt.generateJwtToken(rows[0].id, rows[0].isadmin);
    return res.status(200).json({
      status: 200,
      data: [{
        token,
        user: {
          id: rows[0].id,
          firstname: rows[0].firstname,
          lastname: rows[0].lastname,
          othername: rows[0].othername,
          email: rows[0].email,
          phonenumber: rows[0].phonenumber,
          username: rows[0].username,
          registered: rows[0].registered,
          isadmin: rows[0].isadmin,
        },
      }],
    });
  }

  /**
   * Edit user details
   * @param {Object} req
   * @param {Object} res
   */
  static async editUser(req, res) {
    if (req.file) {
      return Helper.profileupload(req, res);
    }
    const text = `UPDATE users SET username = $1, about = $2 
                  WHERE id = $3 RETURNING *`;
    const values = [
      req.body.username,
      req.body.about,
      req.user.id,
    ];
    const { rows } = await db.query(text, values);

    return res.status(200).json({
      status: 200,
      data: [{
        firstname: rows[0].firstname,
        lastname: rows[0].lastname,
        othername: rows[0].othername,
        email: rows[0].email,
        phonenumber: rows[0].phonenumber,
        username: rows[0].username,
        images: rows[0].images,
        about: rows[0].about,
      }],
    });
  }

  /**
   * edit user password
   * @param {Object} req
   * @param {Object} res
   */
  static async editPassword(req, res) {
    const hashedPassword = hash.hashPassword(req.body.password, 10);
    const text = `UPDATE users SET password = $1
                WHERE id = $2 RETURNING *`;
    const values = [
      hashedPassword,
      req.user.id,
    ];
    const { rows } = await db.query(text, values);

    return res.status(200).json({
      status: 200,
      data: [{
        firstname: rows[0].firstname,
        lastname: rows[0].lastname,
        othername: rows[0].othername,
        email: rows[0].email,
        phonenumber: rows[0].phonenumber,
        username: rows[0].username,
        about: rows[0].about,
      }],
    });
  }

  /**
   * create a meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} meetup object
   */
  static async createMeetup(req, res) {
    if (req.file) {
      return Helper.uploadimage(req, res);
    }
    const tag = req.body.tags;
    const splited = tag.split(',');
    const text = `INSERT INTO meetup(topic,location,happeningon,tags)
                  VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
      req.body.topic,
      req.body.location,
      new Date(req.body.happeningOn),
      splited,
    ];
    const { rows } = await db.query(text, values);
    const formated = moment(rows[0].happeningon).format('dddd, MMMM Do YYYY');
    return res.status(201).json({
      status: 201,
      data: [{
        id: rows[0].id,
        topic: rows[0].topic,
        location: rows[0].location,
        happeningOn: formated,
        tags: rows[0].tags,
      }],
    });
  }
  /**
   * get a meetup by ID
   * @param {object} req
   * @param {object} res
   * @returns {object} a single meetup
   */

  static async getMeetupById(req, res) {
    const text = 'SELECT * FROM meetup WHERE id = $1';
    const id = parseInt(req.params.id, 10);
    const { rows } = await db.query(text, [id]);
    const formated = moment(rows[0].happeningon).format('dddd, MMMM Do YYYY');
    return res.status(200).json({
      status: 200,
      data: [{
        id: rows[0].id,
        topic: rows[0].topic,
        location: rows[0].location,
        happeningOn: formated,
        tags: rows[0].tags,
        images: rows[0].images || null,
      }],
    });
  }

  /**
   * get all meetups
   * @param {object} req
   * @param {object} res
   * @returns {object} all meetups created object
   */
  static async getMeetups(req, res) {
    const text = {
      text: 'SELECT id, topic, location, happeningOn, images,tags FROM meetup',
    };
    const { rows } = await db.query(text);
    const filteredFields = [];

    Questioner.getRequiredFields(rows, filteredFields);

    return res.status(200).json({
      status: 200,
      data: filteredFields,
    });
  }

  /**
   * get all upcoming meetups
   * @param {object} req
   * @param {object} res
   * @returns {objects} all upcoming meetup object
   */
  static async getUpcoming(req, res) {
    const text = {
      text: `SELECT id,topic,location,happeningOn,images,tags
              FROM meetup WHERE happeningOn >= NOW()`,
    };
    const { rows } = await db.query(text);
    const filteredFields = [];
    await Questioner.getRequiredFields(rows, filteredFields);

    return res.status(200).json({
      status: 200,
      data: [
        filteredFields,
      ],
    });
  }

  /**
   * Get upcoming meetup for user
   * @param {*} req
   * @param {*} res
   */
  static async getUserUpcoming(req, res) {
    const text = `SELECT * FROM rsvp WHERE userid = $1 
    AND (response = 'yes' OR response = 'maybe')`;
    const { rows, rowCount } = await db.query(text, [req.user.id]);
    if (rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'no upcoming meetup for user',
      });
    }
    const meetup = `select * from meetup where happeningon >= now()
    order by happeningon asc`;
    const response = await db.query(meetup);
    const upcomingMeetups = rows.map((row) => {
      const filtered = response.rows.filter(resp => resp.id === row.meetupid);
      return filtered;
    });
    return res.status(200).json({
      status: 200,
      data: upcomingMeetups,
    });
  }

  /**
   * creating a question for a meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} new meeetup question object
   */

  static async createQuestion(req, res) {
    const text = `INSERT INTO question(createdBy, meetupId, title, body) 
                  VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
      req.user.id,
      req.body.meetupId,
      req.body.title,
      req.body.body,
    ];
    const { rows } = await db.query(text, values);
    return res.status(201).json({
      status: 201,
      data: [
        {
          id: rows[0].id,
          user: rows[0].createdby,
          meetup: rows[0].meetupid,
          title: rows[0].title,
          body: rows[0].body,
          createdon: rows[0].createdon,
          vote: rows[0].vote,
        },
      ],
    });
  }

  /**
   * get questions by meetupid
   * @param {object} req
   * @param {object} res
   * @returns {object} questions object
   */
  static async getQuestions(req, res) {
    const text = 'select * from question where meetupid = $1 ORDER BY vote DESC';
    const comments = 'select * from comments';
    const users = 'select * from users';
    const id = parseInt(req.params.id, 10);
    const { rows, rowCount } = await db.query(text, [id]);
    const comment = await db.query(comments);
    const user = await db.query(users);
    const questions = [];
    rows.map(async (row) => {
      const createdby = user.rows.filter(post => post.id === row.createdby);
      const questioncomments = comment.rows.filter(item => (item.questionid === row.id));
      const updatecomments = questioncomments.map((comm) => {
        const createdbycomment = user.rows.filter(creator => creator.id === comm.userid);
        const update = {
          id: comm.id,
          questionid: comm.questionid,
          comment: comm.comment,
          userid: createdbycomment[0].username,
          createdon: comm.createdon,
        };
        return update;
      });
      const question = {
        id: row.id,
        createdon: row.createdon,
        createdby: createdby[0].username,
        title: row.title,
        comments: updatecomments,
        body: row.body,
        vote: row.vote,
      };
      questions.push(question);
    });
    return res.status(200).json({
      status: 200,
      questionCount: rowCount,
      data: questions,
    });
  }

  /**
   *  increasing upvote by 1
   * @param {object} req
   * @param {object} res
   * @returns {object} updated vote object
   */

  static async patchQuestionUpvote(req, res) {
    const text = 'SELECT * FROM question WHERE id = $1';
    const values = [parseInt(req.params.id, 10)];
    const { rows } = await db.query(text, values);
    const question = rows[0];

    // Check vote count
    const votes = 'UPDATE question SET vote = $1 WHERE id = $2 returning *';
    const vote = await db.query(votes, [question.vote += 1, req.params.id]);

    return res.status(200).json({
      status: 200,
      data: [{
        meetup: vote.rows[0].meetupid,
        title: rows[0].title,
        body: rows[0].body,
        votes: vote.rows[0].vote,
      }],
    });
  }

  /**
   *  increasing downvote by 1
   * @param {object} req
   * @param {object} res
   * @returns {object} updated vote object
   */

  static async patchQuestionDownvote(req, res) {
    const text = 'SELECT * FROM question WHERE id = $1';
    const values = [parseInt(req.params.id, 10)];

    const { rows } = await db.query(text, values);
    let questions = rows[0];
    if (questions.vote !== 0) {
      const votes = 'UPDATE question SET vote = $1 WHERE id = $2 returning *';
      questions = await db.query(votes, [questions.vote -= 1, req.params.id]);
    } else {
      return res.status(200).json({
        status: 200,
        data: [{
          meetup: questions.meetupid,
          title: questions.title,
          body: questions.body,
          votes: questions.vote,
        }],
      });
    }
    return res.status(200).json({
      status: 200,
      data: [{
        meetup: questions.rows[0].meetupid,
        title: questions.rows[0].title,
        body: questions.rows[0].body,
        votes: questions.rows[0].vote,
      }],
    });
  }

  /**
   *  rsvp for a meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} updated vote object
   */

  static async createRSVP(req, res) {
    const id = parseInt(req.params.id, 10);
    const query = 'SELECT * FROM meetup WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    const text = `INSERT INTO rsvp(meetupid, userid, response)
    VALUES ($1,$2,$3) RETURNING *`;
    const values = [
      id,
      req.user.id,
      req.body.response,
    ];
    const response = await db.query(text, values);
    return res.status(201).json({
      status: 201,
      data: [{
        userid: response.rows[0].userid,
        meetup: response.rows[0].meetupid,
        topic: rows[0].topic,
        status: response.rows[0].response,
      }],
    });
  }

  /**
   * Get Top question feed for upcoming meetup
   * @param {Object} req
   * @param {Object} res
   */
  static async getTopQuestion(req, res) {
    const text = `SELECT * FROM rsvp WHERE userid = $1 
                  AND (response = 'yes' OR response = 'maybe')`;
    const { rows, rowCount } = await db.query(text, [req.user.id]);
    if (rowCount === 0) {
      return res.status(404).json({
        status: 404,
        message: 'no top question(s) for user',
      });
    }
    const question = 'select * from question order by vote desc';
    const meetups = 'select * from meetup where happeningon >= now()';
    const response = await db.query(question);
    const meetup = await db.query(meetups);
    const topquestions = rows.map((row) => {
      const filtered = response.rows.filter(resp => resp.meetupid === row.meetupid);
      const newfiltered = filtered.map((filter) => {
        const meetupName = meetup.rows.filter(meet => filter.meetupid === meet.id);
        const newtop = {
          id: filter.id,
          createdon: filter.createdon,
          createdby: filter.createdby,
          meetupid: filter.meetupid,
          meetupTopic: meetupName[0].topic,
          title: filter.title,
          body: filter.body,
          vote: filter.vote,
        };
        return newtop;
      });
      return newfiltered;
    });
    return res.status(200).json({
      status: 200,
      data: topquestions,
    });
  }

  /**
   *  post comments
   * @param {object} req
   * @param {object} res
   * @returns {object} comments object
   */

  static async postComments(req, res) {
    const text = `INSERT INTO comments (questionId, comment, userid) 
                  VALUES ($1,$2,$3) RETURNING *`;
    const values = [
      req.question.id,
      req.body.comment,
      req.user.id,
    ];
    const { rows } = await db.query(text, values);

    return res.status(201).json({
      status: 201,
      data: [
        {
          question: rows[0].questionid,
          title: req.question.title,
          body: req.question.body,
          comment: rows[0].comment,
          userid: rows[0].userid,
          createdon: rows[0].createdon,
        },
      ],
    });
  }

  /**
   *  delete meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} deleted meetup
   */

  static async deleteMeetup(req, res) {
    const text = 'DELETE FROM meetup WHERE id = $1 RETURNING *';
    const id = parseInt(req.params.id, 10);
    const { rows } = await db.query(text, [id]);

    return res.status(200).json({
      status: 200,
      data: `${rows[0].topic} meet up has been deleted`,
    });
  }

  /**
   *  post tags to meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} posted tags object
   */

  static async postTags(req, res) {
    const text = `UPDATE meetup SET tags = (select array_agg(distinct e)
                   from unnest(tags || $1) e) WHERE id = $2 returning *`;
    const id = parseInt(req.params.id, 10);
    const tag = req.body.tags;
    const splited = tag.split(',');
    try {
      const { rows } = await db.query(text, [splited, id]);
      return res.status(200).json({
        status: 200,
        meetup: rows[0].id,
        topic: rows[0].topic,
        tags: rows[0].tags,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  /**
   * post images to meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} post images response
   */
  static postImages(req, res) {
    const file = dataUri.dataUri(req).content;
    return cloudinary.v2.uploader.upload(file, {
      folder: 'questioner',
      use_filename: true,
      resource_type: 'image',
    })
      .then(async (result) => {
        const images = result.url;
        const text = `UPDATE meetup SET images = (select array_agg(distinct e)
                  from unnest(images || $1) e) WHERE id = $2 returning *`;
        const id = parseInt(req.params.id, 10);
        const splited = images.split(',');
        const { rows } = await db.query(text, [splited, id]);
        return res.status(200).json({
          status: 200,
          meetup: rows[0].id,
          topic: rows[0].topic,
          images: rows[0].images,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          status: 400,
          message: err.message,
        });
      });
  }
}

export default Questioner;
