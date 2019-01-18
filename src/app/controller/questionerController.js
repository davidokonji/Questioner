import db from '../config/db';

import jwt from '../middleware/jwtToken';

import hash from '../middleware/hashPassword';

class Questioner {
  /**
   * getRequiredfields method
   * @param {object} meetups
   * @param {array} filtered
   * @returns {array} filtered fields
   */
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
      req.body.email,
      hashedPassword,
      req.body.phonenumber,
      req.body.username,
      req.body.isadmin || false,
    ];
    try {
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
    } catch (error) {
      return res.status(400).json({
        status: 400,
        meesage: 'invalid user credentials',
      });
    }
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
      req.body.email,
    ];
    try {
      const { rows } = await db.query(text, values);

      const matchedPassword = hash.verifyPassword(req.body.password, rows[0].password);

      if (!matchedPassword) {
        return res.status(400).json({
          status: 400,
          message: 'invalid credential',
        });
      }
      const token = await jwt.generateJwtToken(rows[0].id, rows[0].isadmin);
      return res.status(201).json({
        status: 201,
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
          },
        }],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'user not found',
      });
    }
  }


  /**
   * create a meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} meetup object
   */
  static async createMeetup(req, res) {
    const text = `INSERT INTO meetup(topic,location,happeningon)
                   VALUES ($1,$2,$3) RETURNING *`;
    const values = [
      req.body.topic,
      req.body.location,
      new Date(req.body.happeningOn),
    ];
    try {
      const { rows } = await db.query(text, values);

      return res.status(201).json({
        status: 201,
        data: [{
          topic: rows[0].topic,
          location: rows[0].location,
          happeningOn: rows[0].happeningOn,
          tags: rows[0].tags,
        }],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'error in creating meetup',
      });
    }
  }
  /**
   * get a meetup by ID
   * @param {object} req
   * @param {object} res
   * @returns {object} a single meetup
   */

  static async getMeetupById(req, res) {
    const text = 'SELECT * FROM meetup WHERE id = $1';
    try {
      const id = parseInt(req.params.id, 10);
      const { rows } = await db.query(text, [id]);

      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'unable to find meetup with given ID',
        });
      }
      return res.status(200).json({
        status: 200,
        data: [{
          id: rows[0].id,
          topic: rows[0].topic,
          location: rows[0].location,
          happeningOn: rows[0].happeningOn,
          tags: rows[0].tags,
        }],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'unable to find meetup',
      });
    }
  }

  /**
   * get all meetups
   * @param {object} req
   * @param {object} res
   * @returns {object} all meetups created object
   */
  static async getMeetups(req, res) {
    const text = {
      text: 'SELECT id, topic, location, happeningOn, tags FROM meetup',
    };
    try {
      const { rows } = await db.query(text);
      const filteredFields = [];

      Questioner.getRequiredFields(rows, filteredFields);

      return res.status(200).json({
        status: 200,
        data: filteredFields,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'no meetups available',
      });
    }
  }

  /**
   * get all upcoming meetups
   * @param {object} req
   * @param {object} res
   * @returns {objects} all upcoming meetup object
   */
  static async getUpcoming(req, res) {
    const text = {
      text: `SELECT id,topic,location,happeningOn,tags 
              FROM meetup WHERE happeningOn >= NOW()`,
    };

    try {
      const { rows, rowCount } = await db.query(text);
      const filteredFields = [];
      if (rowCount === 0) {
        return res.status(404).json({
          status: 404,
          data: [{
            message: 'no upcoming meetup found',
          }],
        });
      }
      await Questioner.getRequiredFields(rows, filteredFields);

      return res.status(200).json({
        status: 200,
        data: [
          filteredFields,
        ],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'no upcoming meetup found',
      });
    }
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
      req.body.meetup || 1,
      req.body.title,
      req.body.body,
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).json({
        status: 201,
        data: [
          {
            user: rows[0].createdby,
            meetup: rows[0].meetupid,
            title: rows[0].title,
            body: rows[0].body,
          },
        ],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'unable to create question',
      });
    }
  }

  /**
   * get one question (only oin test environment)
   * @param {object} req
   * @param {object} res
   * @returns {object} single queston object
   */
  static async getQuestionById(req, res) {
    const text = 'SELECT * FROM question WHERE id= $1 RETURNING *';
    const id = parseInt(req.params.id, 10);
    try {
      const { rows } = await db.query(text, [id]);

      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: `unable to find question with given ID ${req.params.id}`,
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        meesage: 'unable to find question',
      });
    }
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

    try {
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
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'can not upvote this question',
      });
    }
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

    try {
      const { rows } = await db.query(text, values);
      let questions = rows[0];
      if (questions.vote !== 0) {
        const votes = 'UPDATE question SET vote = $1 WHERE id = $2 returning *';
        try {
          questions = await db.query(votes, [questions.vote -= 1, req.params.id]);
        } catch (error) {
          return res.status(400).json({
            status: 400,
            message: error.meesage,
          });
        }
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
    } catch (error) {
      return res.status(200).json({
        status: 200,
        message: 'unable to downvote question',
      });
    }
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
    try {
      const { rows } = await db.query(query, [id]);
      if (rows[0].length !== 0) {
        const text = `INSERT INTO rsvp(meetupid, userid, response)
        VALUES ($1,$2,$3) RETURNING *`;
        const values = [
          id,
          req.user.id,
          req.body.response,
        ];
        try {
          const response = await db.query(text, values);
          return res.status(201).json({
            status: 201,
            data: [{
              meetup: response.rows[0].meetupid,
              topic: rows[0].topic,
              status: response.rows[0].response,
            }],
          });
        } catch (error) {
          return res.status(400).json({
            status: 400,
            message: 'unable to rsvp for meetup',
          });
        }
      }
    } catch (error) {
      return error.meesage;
    }
    return true;
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
    try {
      const { rows } = await db.query(text, values);

      return res.status(201).json({
        status: 201,
        data: [
          {
            question: rows[0].questionid,
            title: req.question.title,
            body: req.question.body,
            comment: rows[0].comment,
          },
        ],
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'can not post comment',
      });
    }
  }

  /**
   *  delete meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} deleted meetup
   */

  static async deleteMeetup(req, res) {
    const text = 'DELETE FROM meetup WHERE id = $1 RETURNING *';

    try {
      const id = parseInt(req.params.id, 10);
      const { rows } = await db.query(text, [id]);

      return res.status(202).json({
        status: 202,
        data: `meetup with title ${rows[0].topic} has been deleted`,
      });
    } catch (error) {
      return res.status(404).json({
        status: 404,
        message: 'meetup can not be deleted',
      });
    }
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

  static async postImages(req, res) {
    const text = `UPDATE meetup SET images = (select array_agg(distinct e)
                   from unnest(images || $1) e) WHERE id = $2 returning *`;
    const id = parseInt(req.params.id, 10);
    const images = req.file.path;
    const splited = images.split(',');
    try {
      const { rows } = await db.query(text, [splited, id]);
      return res.status(200).json({
        status: 200,
        meetup: rows[0].id,
        topic: rows[0].topic,
        images: rows[0].images,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }
}

export default Questioner;