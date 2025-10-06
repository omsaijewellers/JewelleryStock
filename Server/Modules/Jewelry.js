const mongoose = require('mongoose');

const JewelrySchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Gold', 'Silver'], required: true },
  weight: { type: Number, required: true },   // grams
  wastage: { type: Number, default: 0 },      // grams
  pieces: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true },
  qrCodeData: { type: String }, // store the content encoded in QR (string)
}, { timestamps: true });

module.exports = mongoose.model('Jewelry', JewelrySchema);
