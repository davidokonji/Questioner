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
    let isValid = true;
    if (typeof data === 'string') {
      const trimmed = data.trim();
      const valid = trimmed.length;
      if (valid <= minlength) {
        isValid = false;
      }
    }
    return [isValid, minlength];
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

  static verifyMeetupCount(res, text) {
    return res.status(200).send({
      status: 200,
      message: `no ${text} found`,
    });
  }

  static validQuestionfieldLength(res) {
    return res.status(400).send({
      status: 400,
      error: 'fill all required fields',
    });
  }

  static validID(res, text) {
    return res.status(404).send({
      status: 404,
      error: `unable to find ${text[0]} with given meetup ID ${text[1]}`,
    });
  }

  static validNumber(bodyElement) {
    if (typeof bodyElement !== 'number') {
      return false;
    }
    return true;
  }

  static validResponse(bodyValue) {
    if (typeof bodyValue !== 'string') {
      return false;
    }
    return true;
  }

  static validLengthResponse(res, text, length) {
    return res.status(400).send({
      status: 400,
      error: `${text} should have minimum length of ${length}`,
    });
  }
}

export default Validation;
