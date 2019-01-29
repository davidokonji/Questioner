import cloudinary from 'cloudinary';

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

      return res.status(201).json({
        status: 201,
        data: [{
          topic: rows[0].topic,
          location: rows[0].location,
          happeningOn: rows[0].happeningOn,
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
}
export default Helper.uploadimage;
