import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';

// import config from '../config/config';

dotenv.config();

class jwtToken {
  /**
   * Generate jwt token
   * @param {number} id
   * @returns {string} encrypted token
   */
  static generateJwtToken(id, admin) {
    const token = jwt.sign({
      userid: id,
      isadmin: admin,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: '1d',
    });
    return token;
  }

  /**
   * verify jwt token
   * @param {string} token
   * @param {string} key
   * @returns {boolean} return true or false
   */
  static verifyToken(token, key) {
    return jwt.verify(token, key);
  }
}
export default jwtToken;
