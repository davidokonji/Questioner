import dotenv from 'dotenv';

import db from '../config/db';

import jwt from './jwtToken';

dotenv.config();

class Authenticate {
  /**
   * verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} generated token object
   */
  static async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) {
      return res.status(401).send({
        status: 401,
        error: 'no authorized token provided',
      });
    }
    try {
      const decodedToken = await jwt.verifyToken(token, process.env.SECRET_KEY);

      // const currentDate = new Date().getTime() / 1000;
      // if (decodedToken.exp < currentDate) {
      //   return res.status(401).send({
      //     status: 401,
      //     error: 'token provided has expired',
      //   });
      // }

      const querytext = 'SELECT * FROM users WHERE id =$1';

      const { rows } = await db.query(querytext, [decodedToken.userid]);
      // if (!rows[0]) {
      //   return res.status(401).send({
      //     status: 401,
      //     error: 'invalid token provided',
      //   });
      // }
      req.user = {
        id: rows[0].id,
        isadmin: rows[0].isadmin,
      };
      return next();
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: 'invalid token provided.',
      });
    }
  }
}
export default Authenticate.verifyToken;
