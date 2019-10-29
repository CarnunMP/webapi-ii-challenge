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

server.post('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  db.findById(id)
    .then((post) => {
      if (Array.isArray(post) && post.length === 0) {
        res.status(404).json({
          success: false,
          message: 'There is no post corresponding to the specified ID.',
        });
      } else {
        const commentToPost = {
          text,
          post_id: id,
        };

        db.insertComment(commentToPost)
          .then((data) => {
            res.status(201).json({
              success: true,
              id: data.id,
            });
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

server.get('/api/posts', (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json({
        success: true,
        posts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

server.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then((post) => {
      if (Array.isArray(post) && post.length === 0) {
        res.status(404).json({
          success: false,
          message: 'There is no post corresponding to the specified ID.',
        });
      } else {
        res.status(200).json({
          success: true,
          post: post[0],
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

server.get('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      if (Array.isArray(post) && post.length === 0) {
        res.status(404).json({
          success: false,
          message: 'There is no post corresponding to the specified ID.',
        });
      } else {
        db.findPostComments(id)
          .then((comments) => {
            if (comments.length === 0) {
              res.status(404).json({
                success: false,
                message: 'There are no comments on this post.',
              });
            } else {
              res.status(200).json({
                success: true,
                comments,
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        err,
      });
    });
});

server.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then((post) => {
      if (Array.isArray(post) && post.length === 0) {
        res.status(404).json({
          success: false,
          message: 'There is no post corresponding to the specified ID.',
        });
      } else {
        db.remove(id)
          .then((count) => {
            res.status(410).json({
              success: true,
              deletedPost: post[0],
              count,
            });
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              err,
            });
          });
      }
    });
});

module.exports = server;
