import validator from 'validator';
import Validation from './validationhelper';
import db from '../config/db';

class Validate {
  /**
   * create meetup middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */
  static createMeetup(req, res, next) {
    const getRequired = Validation.checkValidEntry(req.body, ['topic', 'location', 'happeningOn']);
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
    const [valid, length] = Validation.isValidLength(req.body.topic, 5);
    if (!valid) {
      return Validation.validLengthResponse(res, 'topic', length);
    }
    const [validlocation, locationLength] = Validation.isValidLength(req.body.location, 5);
    if (!validlocation) {
      return Validation.validLengthResponse(res, 'location', locationLength);
    }
    return next();
  }
  /**
   * get one meetup middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static async GetOneMeetup(req, res, next) {
    const id = parseInt(req.params.id, 10);
    try {
      const text = 'SELECT * FROM meetup WHERE id = $1';
      const { rowCount } = await db.query(text, [id]);
      if (rowCount === 0) {
        return Validation.validID(res, ['meetup', id]);
      }
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'meetup does not exist',
      });
    }
    return next();
  }
  /**
   * get all meetup middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static GetAllMeetups(req, res, next) {
    try {
      const text = 'SELECT * FROM meetup';
      const { rowCount } = db.query(text);
      if (rowCount === 0) {
        return Validation.verifyMeetupCount(res, 'meetup');
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'unable to get available meetups',
      });
    }
    return next();
  }
  /**
   * get upcoming meetup middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static GetUpcoming(req, res, next) {
    const text = {
      text: 'SELECT id,topic,location,happeningOn,tags FROM meetup WHERE happeningOn >= NOW()',
    };
    try {
      const { rowCount } = db.query(text);
      if (rowCount === 0) {
        return Validation.verifyMeetupCount(res, 'upcoming meetup');
      }
    } catch (error) {
      return res.status(404).json({
        status: 404,
        message: error.message,
      });
    }
    return next();
  }

  /**
   * create question middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static CreateQuestion(req, res, next) {
    const getRequired = Validation.checkValidEntry(req.body, ['title', 'body']);
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
    return next();
  }
  /**
   * patch upvote middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static patchUpvote(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM question WHERE id = $1';
    const { rowCount } = db.query(text, [id]);
    if (rowCount === 0) {
      return Validation.validID(res, ['question', id]);
    }
    return next();
  }
  /**
   * patch downvote middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static patchDownvote(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM question WHERE id = $1';
    try {
      const { rowCount } = db.query(text, [id]);
      if (rowCount === 0) {
        return Validation.validID(res, ['question', id]);
      }
    } catch (error) {
      return res.status(500).json({
        error: 500,
        message: error.message,
      });
    }

    return next();
  }
  /**
   * create rsvp middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static createRsvp(req, res, next) {
    if (!req.body.response) {
      return res.status(400).send({
        status: 400,
        message: 'response is required',
      });
    }
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM meetup WHERE id = $1';
    const { rowCount } = db.query(text, [id]);
    if (rowCount === 0) {
      return Validation.validID(res, ['meetup', id]);
    }

    const validResponse = Validation.validResponse(req.body.response);
    if (!validResponse) {
      return res.status(400).send({
        status: 400,
        error: `response value '${req.body.response}' is not valid  `,
      });
    }
    return next();
  }

  /**
   * create user middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */
  static async createUser(req, res, next) {
    const getRequired = Validation.checkValidEntry(req.body, ['firstname', 'lastname', 'othername', 'password', 'email', 'phonenumber', 'username']);
    const errorValues = getRequired.map(error => error);
    if (typeof getRequired === 'object' && getRequired.length > 0) {
      return res.status(400).json({
        status: 400,
        error: errorValues,
      });
    }
    const validEmail = validator.isEmail(req.body.email);
    if (!validEmail) {
      return res.status(400).json({
        status: 400,
        error: `Email value,  ${req.body.email} is not a valid Email`,
      });
    }
    const sortSpecialchars = validator.isAlphanumeric(req.body.username);
    if (!sortSpecialchars) {
      return res.status(400).json({
        status: 400,
        error: `Username value,  ${req.body.username} should be aplhanumeric`,
      });
    }
    try {
      const text = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await db.query(text, [req.body.email]);
      if (rows[0]) {
        return res.status(400).json({
          status: 400,
          message: 'user account already exist',
        });
      }
      const text1 = 'SELECT * FROM users WHERE username = $1';
      const response = await db.query(text1, [req.body.username]);
      if (response.rows[0]) {
        return res.status(400).json({
          status: 400,
          message: 'username already exist',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'invalid data',
      });
    }
    const validphonenumber = validator.isMobilePhone(req.body.phonenumber);
    if (!validphonenumber) {
      return res.status(400).send({
        status: 400,
        error: `Phone number ${req.body.phonenumber} is not valid`,
      });
    }
    return next();
  }

  /**
   * login middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static async loginUser(req, res, next) {
    const getRequired = Validation.checkValidEntry(req.body, ['email', 'password']);
    const errorValues = getRequired.map(error => error);
    if (typeof getRequired === 'object' && getRequired.length > 0) {
      return res.status(400).send({
        status: 400,
        error: errorValues,
      });
    }
    const validEmail = validator.isEmail(req.body.email);
    if (!validEmail) {
      return res.status(400).send({
        status: 400,
        error: `Email value,  ${req.body.email} is not a valid Email`,
      });
    }
    try {
      const text = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).json({
          status: 400,
          message: 'user account does not exist',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'invalid data',
      });
    }

    return next();
  }

  /**
   * creating comment middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return  {object} error or pass object
   */
  static async postComments(req, res, next) {
    try {
      // const { questionId } = req.body;
      const text = 'SELECT * FROM question WHERE id= $1';

      const { rows } = await db.query(text, [req.body.questionId]);
      if (rows.length < 1) {
        return res.status(400).json({
          status: 400,
          message: 'question ID does not exist',
        });
      }
      req.question = rows[0];

      // next();
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
    const getRequired = Validation.checkValidEntry(req.body, ['comment']);
    const errorValues = getRequired.map(error => error);
    if (typeof getRequired === 'object' && getRequired.length > 0) {
      return res.status(400).send({
        status: 400,
        error: errorValues,
      });
    }
    return next();
  }

  /**
   * delete meetup middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return  {object} error or pass object
   */

  static deleteMeetup(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM meetup WHERE id = $1';
    try {
      const { rows, rowCount } = db.query(text, [id]);
      if (rowCount === 0 && !rows[0]) {
        return Validation.validID(res, ['meetup', id]);
      }
    } catch (error) {
      return res.status(500).send({
        status: 500,
        message: 'meetup can not be deleted',
      });
    }
    return next();
  }

  /**
   * post tags middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return  {object} error or pass object
   */

  static postTags(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM meetup WHERE id = $1';
    const { rows, rowCount } = db.query(text, [id]);
    if (rowCount === 0 && !rows[0].id) {
      return Validation.validID(res, ['meetup', id]);
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
    return next();
  }
}

export default Validate;
