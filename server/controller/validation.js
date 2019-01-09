class Validation {
  static validateDate(date) {
    let valid = true;
    const regex = new RegExp('([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})');
    const validDate = regex.test(date);

    if (!validDate) {
      valid = false;
    }
    return [valid, date];
  }

  static isValidLength(data, minlength) {
    let check = true;
    if (typeof data === 'string') {
      const trimmed = data.trim();
      const valid = trimmed.length;
      if (valid <= minlength) {
        check = false;
      }
    }
    return [check, minlength];
  }

  static validateEntry(body) {
    const entry = [];
    Object.keys(body).forEach((item) => {
      if (typeof body[item] === 'string') {
        const trimmed = body[item].trim();
        entry.push(trimmed);
      }
    });
    const valid = entry.filter(val => val.length !== 0);
    if (valid.length !== entry.length) {
      return false;
    }
    return true;
  }
}

export default Validation;
