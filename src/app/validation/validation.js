import validator from 'validator';
import Validation from './validationhelper';
import db from '../config/db';

class Validate {
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
      return Validation.validatorResponse(res, ['Email', req.body.email, 'a valid Email']);
    }
    const trimmedUsername = req.body.username.replace(/\s/g, '');
    const sortSpecialchars = validator.isAlphanumeric(trimmedUsername);
    if (!sortSpecialchars) {
      return Validation.validatorResponse(res, ['Username', req.body.username, 'aplhanumeric']);
    }
    try {
      const text = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await db.query(text, [req.body.email]);
      if (rows[0]) {
        return Validation.alreadyExist(res, req.body.email);
      }
      const text1 = 'SELECT * FROM users WHERE username = $1';
      const response = await db.query(text1, [req.body.username]);
      if (response.rows[0]) {
        return Validation.alreadyExist(res, req.body.username);
      }
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'invalid data',
      });
    }
    const validFirstname = validator.isAlpha(req.body.firstname);
    if (!validFirstname) {
      return Validation.validatorResponse(res, ['First Name', req.body.firstname, 'valid']);
    }
    const validLastname = validator.isAlpha(req.body.lastname);
    if (!validLastname) {
      return Validation.validatorResponse(res, ['Last Name', req.body.lastname, 'valid']);
    }
    if (req.body.othername) {
      const validOthername = validator.isAlpha(req.body.othername);
      if (!validOthername) {
        return Validation.validatorResponse(res, ['Other Name', req.body.othername, 'valid']);
      }
    }
    const validPasswordLength = validator.isLength(req.body.password, {
      min: 8,
      max: 50,
    });
    if (!validPasswordLength) {
      return res.status(400).send({
        status: 400,
        error: 'Password, should be more than 7 digits',
      });
    }
    const validphonenumber = validator.isMobilePhone(req.body.phonenumber);
    if (!validphonenumber) {
      return Validation.validatorResponse(res, ['Phone Number', req.body.phonenumber, 'valid']);
    }
    return next();
  }

  /**
   * login user middleware
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
      return Validation.validatorResponse(res, ['Email', req.body.email, 'a valid Email']);
    }
    try {
      const text = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          message: 'user account does not exist',
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'invalid credentials',
      });
    }

    return next();
  }

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
    const [isValidDate, actualDate] = Validation.validateDate(req.body.happeningOn);
    if (!isValidDate) {
      return res.status(400).send({
        status: 400,
        error: `happeningOn value, ${actualDate} should be a valid date format YYYY-MM-DD`,
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

  static async GetAllMeetups(req, res, next) {
    try {
      const text = 'SELECT * FROM meetup';
      const { rowCount } = await db.query(text);
      if (rowCount === 0) {
        return Validation.verifyMeetupCount(res, 'meetup');
      }
    } catch (error) {
      return res.status(400).json({
        status: 400,
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

  static async GetUpcoming(req, res, next) {
    const text = {
      text: 'SELECT id,topic,location,happeningOn,tags FROM meetup WHERE happeningOn >= NOW()',
    };
    try {
      const { rowCount } = await db.query(text);
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

  static async patchUpvote(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM question WHERE id = $1';
    const { rowCount } = await db.query(text, [id]);
    if (rowCount !== 0) {
      return next();
    }
    return Validation.validID(res, ['question', id]);
  }
  /**
   * patch downvote middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static async patchDownvote(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM question WHERE id = $1';
    const { rowCount } = await db.query(text, [id]);
    if (rowCount !== 0) {
      return next();
    }
    return Validation.validID(res, ['question', id]);
  }
  /**
   * create rsvp middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object} error or pass object
   */

  static async createRsvp(req, res, next) {
    if (!req.body.response) {
      return res.status(400).send({
        status: 400,
        message: 'response is required',
      });
    }
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM meetup WHERE id = $1';
    const { rowCount } = await db.query(text, [id]);
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
   * creating comment middleware
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return  {object} error or pass object
   */
  static async postComments(req, res, next) {
    const getRequired = Validation.checkValidEntry(req.body, ['comment', 'questionId']);
    const errorValues = getRequired.map(error => error);
    if (typeof getRequired === 'object' && getRequired.length > 0) {
      return res.status(400).send({
        status: 400,
        error: errorValues,
      });
    }
    const text = 'SELECT * FROM question WHERE id= $1';

    const { rows } = await db.query(text, [req.body.questionId]);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: 'question ID does not exist',
      });
    }
    req.question = rows[0];
    const trimmedComment = req.body.comment.replace(/\s/g, '');
    const validcomment = validator.isAlphanumeric(trimmedComment);
    if (!validcomment) {
      return res.status(400).json({
        status: 400,
        message: `comment value, ${req.body.comment} should be a valid string`,
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

  static async deleteMeetup(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const text = 'SELECT * FROM meetup WHERE id = $1';
    const { rows, rowCount } = await db.query(text, [id]);
    if (!rows[0] && rowCount === 0) {
      return Validation.validID(res, ['meetup', id]);
    }
    return next();
  }
}

export default Validate;
