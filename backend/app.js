const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;


mongoose.connect('mongodb://mongodb:27017/inventory_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const fruitSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  rating: Number
});

const Fruit = mongoose.model('Fruit', fruitSchema, 'products');

app.get('/', async (req, res) => {
  try {

    const appleData = await Fruit.findOne({ name: 'apples' });
    
    if (appleData) {
      res.send(`
        <html>
          <body style="text-align: center; font-family: Arial; padding-top: 50px;">
            <h1>Hello World! 🍎</h1>
            <p style="font-size: 24px;">Number of apples in the DB: <strong>${appleData.qty}</strong></p>
          </body>
        </html>
      `);
    } else {
      res.send('<h1>No apples found in the DB! 😢</h1>');
    }
  } catch (err) {
    res.status(500).send('Error connecting to DB: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
