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

  static pastDate(date) {
    const currentDate = new Date().getTime();
    if (new Date(date).getTime() < currentDate) {
      return false;
    }
    return true;
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
      error: 'required fields not sent',
    });
  }

  static checkValidEntry(req, body) {
    const requiredValues = [];
    if (!Array.isArray(body)) {
      return 'body should be an array';
    }
    if (body.length === 0) {
      return 'body should not be empty';
    }
    const bugs = {
      notString: false,
      emptyString: false,
    };
    body.forEach((value) => {
      if (typeof value !== 'string') {
        bugs.notString = true;
      }

      if (value.length < 1) {
        bugs.emptyString = true;
      }
      if (!Object.keys(req).includes(value)) {
        requiredValues.push({
          [value]: `${value} value is required`,
        });
      }
    });

    if (bugs.emptyString) {
      return 'body passed must not be empty';
    }
    if (bugs.notString) {
      return 'value(s) passed in to body should have a type string';
    }

    return requiredValues;
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
    if (bodyValue.length > 5) {
      return false;
    }
    if (!bodyValue.toLowerCase() === 'yes' || !bodyValue.toLowerCase() === 'no' || !bodyValue.toLowerCase() === 'maybe') {
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

  static validateArray(data) {
    if (!Array.isArray(data)) {
      return false;
    }
    return true;
  }

  static validArrayValues(data) {
    if (data.length === 0) {
      return false;
    }
    const valid = [];

    data.forEach((value) => {
      if (!(value.trim().length === 0)) {
        valid.push(value);
      }
    });
    if (valid.length !== data.length) {
      return false;
    }
    return true;
  }
}

export default Validation;
