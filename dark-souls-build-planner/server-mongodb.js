const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3002;

mongoose.connect('mongodb://localhost:27017/dark_souls_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const Class = mongoose.model('Class', new mongoose.Schema({
  name: String,
  attributes: Object
}));

const Weapon = mongoose.model('Weapon', new mongoose.Schema({
  name: String,
  atk: Object,
  def: Object,
  effects: Object,
  req: Object,
  scale: Object,
  durability: Number,
  weight: Number,
  attackTypes: Array,
  obtained: Array,
  aotaOnly: String
}));

const Armor = mongoose.model('Armor', new mongoose.Schema({
  name: String,
  def: Object,
  resist: Object,
  poise: Number,
  weight: Number
}));

const Ring = mongoose.model('Ring', new mongoose.Schema({
  name: String,
  effects: Object
}));

app.get('/api/classes', async (req, res) => {
  const classes = await Class.find();
  res.json(classes);
});

app.get('/api/weapons', async (req, res) => {
  const weapons = await Weapon.find();
  res.json(weapons);
});

app.get('/api/armor', async (req, res) => {
  const armor = await Armor.find();
  res.json(armor);
});

app.get('/api/rings', async (req, res) => {
  const rings = await Ring.find();
  res.json(rings);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
