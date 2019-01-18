import bcrypt from 'bcrypt';

class hash {
  /**
   * hashing password
   * @param {string} password
   * @returns {string} hashed password
   */
  static hashPassword(password) {
    const hashed = bcrypt.hashSync(password, 10);
    return hashed;
  }
  /**
   * verify hashed password
   * @param {string} password
   * @param {string} hash
   * @returns {boolean} returns true or false
   */

  static verifyPassword(password, hashed) {
    const verify = bcrypt.compareSync(password, hashed);
    return verify;
  }
}
export default hash;
