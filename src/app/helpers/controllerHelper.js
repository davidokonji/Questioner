import cloudinary from 'cloudinary';

import moment from 'moment';

import dataUri from '../middleware/uploadfile';

import db from '../config/db';

class Helper {
  static uploadimage(req, res) {
    const tag = req.body.tags;
    const splited = tag.split(',');
    const file = dataUri.dataUri(req).content;
    return cloudinary.v2.uploader.upload(file, {
      folder: 'questioner',
      use_filename: true,
      resource_type: 'image',
    }).then(async (result) => {
      const images = result.url;
      const splitedImages = images.split(',');
      const text = `INSERT INTO meetup(topic,location,happeningon,tags,images)
                   VALUES ($1,$2,$3,$4,$5) RETURNING *`;
      const values = [
        req.body.topic,
        req.body.location,
        new Date(req.body.happeningOn),
        splited,
        splitedImages,
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
          images: rows[0].images,
        }],
      });
    })
      .catch((err) => {
        return res.status(400).json({
          status: 400,
          message: err.message,
        });
      });
  }

  static async profileupload(req, res) {
    const file = dataUri.dataUri(req).content;
    return cloudinary.v2.uploader.upload(file, {
      folder: 'questioner/userprofile',
      use_filename: true,
      resource_type: 'image',
    }).then(async (result) => {
      const images = result.url;
      const splitedImages = images.split(',');
      const text = `UPDATE users SET username = $1, about = $2, images = $3
                    WHERE id = $4 RETURNING *`;
      const values = [
        req.body.username,
        req.body.about,
        splitedImages,
        req.user.id,
      ];
      const { rows } = await db.query(text, values);

      return res.status(200).json({
        status: 200,
        data: {
          firstname: rows[0].firstname,
          lastname: rows[0].lastname,
          othername: rows[0].othername,
          email: rows[0].email,
          phonenumber: rows[0].phonenumber,
          username: rows[0].username,
          images: rows[0].images,
          about: rows[0].about,
        },
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
export default Helper;
