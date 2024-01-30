const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageData: { type: Buffer, required: true },
});

const Image = mongoose.model('Image143', imageSchema);

module.exports = Image;
