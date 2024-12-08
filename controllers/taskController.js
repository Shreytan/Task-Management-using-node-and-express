const db = require('../models/Task');

exports.createTask = (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title) return res.status(400).send('Title is required.');

  db.run("INSERT INTO tasks (userId, title, description, completed) VALUES (?, ?, ?, ?)", [userId, title, description, false], function(err) {
    if (err) return res.status(500).send('Server error.');
    res.status(201).send({ id: this.lastID });
  });
};

exports.getTasks = (req, res) => {
  const userId = req.user.id;

  db.all("SELECT * FROM tasks WHERE userId = ?", [userId], (err, tasks) => {
    if (err) return res.status(500).send('Server error.');
    res.send(tasks);
  });
};

exports.updateTask = (req, res) => {
  const { title, description, completed } = req.body;
  const taskId = req.params.id;

  db.run("UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?", [title, description, completed, taskId], function(err) {
    if (err) return res.status(500).send('Server error.');
    res.send({ id: taskId });
  });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;

  db.run("DELETE FROM tasks WHERE id = ?", [taskId], function(err) {
    if (err) return res.status(500).send('Server error.');
    res.send({ id: taskId });
  });
};
