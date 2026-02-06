const jwt = require('jsonwebtoken');
const prisma = require('../db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, JWT_SECRET);
    // Attach user to request (id & email)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
