const express = require('express');
const db = require('./config/connection');

const PORT = 3001;
const app = express();





db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});