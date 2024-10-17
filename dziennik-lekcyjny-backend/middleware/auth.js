// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Brak tokenu autoryzacji' });

  try {
    const decoded = jwt.verify(token, 'tajny_klucz');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Nieprawidłowy token' });
  }
};

module.exports = auth;