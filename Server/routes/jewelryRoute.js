const express = require('express');
const Jewelry = require('../Modules/Jewelry');
const auth = require('../Middleware/auth');

const router = express.Router();

// GET list (supports query: q=search, category=Gold/Silver)
router.get('/', auth, async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ productId: regex }, { name: regex }, { category: regex }];
    }
    const items = await Jewelry.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single by id
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Jewelry.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { productId, name, category, weight, wastage = 0, pieces, price, qrCodeData } = req.body;
    if (!productId || !name) return res.status(400).json({ message: 'Missing required' });
    const exists = await Jewelry.findOne({ productId });
    if (exists) return res.status(400).json({ message: 'Product ID already exists' });

    const item = await Jewelry.create({ productId, name, category, weight, wastage, pieces, price, qrCodeData });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    await Jewelry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SELL endpoint: decrement pieces by 1 (or qty)
router.post('/sell/:id', auth, async (req, res) => {
  try {
    const qty = parseInt(req.body.qty || 1, 10);
    const item = await Jewelry.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (item.pieces < qty) return res.status(400).json({ message: 'Insufficient pieces' });

    item.pieces -= qty;
    await item.save();
    res.json({ message: 'Sold', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE (moved to bottom)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Jewelry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
