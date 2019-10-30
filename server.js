const express = require('express');
const router = require('./posts-router');

const server = express();

server.use(express.json());
server.use('/api/posts', router);

server.get('/', (req, res) => {
  res.json('Hello World!');
});

module.exports = server;
