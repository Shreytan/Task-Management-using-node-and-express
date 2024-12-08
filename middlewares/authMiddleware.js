const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).send('Access denied.');

  try {
    const verified = verifyToken(token);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};
