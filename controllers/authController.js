const db = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

exports.register = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).send('Username and password are required.');

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Server error.');

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], function(err) {
      if (err) return res.status(500).send('Server error.');
      res.status(201).send({ id: this.lastID });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).send('Username and password are required.');

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).send('Server error.');
    if (!user) return res.status(404).send('User not found.');

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Server error.');
      if (!isMatch) return res.status(401).send('Invalid password.');

      const token = generateToken(user);
      res.send({ token });
    });
  });
};
