const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.json('Hello World!');
});


server.post('/api/posts', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      success: false,
      message: 'Please provide a title and contents.',
    });
  } else {
    db.insert({ title, contents })
      .then((data) => {
        res.status(201).json({
          success: true,
          id: data.id,
        });
      })
      .catch((err) => {
        res.status(500).json({
          err,
          message: 'There was an error while saving the post to the database',
        });
      });
  }
});

module.exports = server;
