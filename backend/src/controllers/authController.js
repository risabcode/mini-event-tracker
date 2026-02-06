const prisma = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES_IN = '7d';

async function signup(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  logger.info('Signup attempt', { ip, body: { email: req.body?.email, password: req.body?.password ? '****' : undefined } });

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn('Signup validation failed: missing fields', { ip, body: mask(req.body) });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      logger.warn('Signup failed: email already in use', { ip, email });
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed }
    });

    logger.info('User created', { userId: user.id, email: user.email, ip });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    logger.error('Signup error', { err: err?.stack || err?.message || err });
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  logger.info('Login attempt', { ip, email: req.body?.email });

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn('Login validation failed: missing fields', { ip, body: { email } });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn('Login failed: user not found', { ip, email });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      logger.warn('Login failed: incorrect password', { ip, userId: user.id, email });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    logger.info('Login successful', { userId: user.id, email, ip, cookieSet: true });
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    logger.error('Login error', { err: err?.stack || err?.message || err });
    res.status(500).json({ message: 'Server error' });
  }
}

async function logout(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  logger.info('Logout', { ip, userId: req.user?.id || null });
  res.clearCookie('token');
  return res.status(204).send();
}

async function me(req, res) {
  logger.info('Me requested', { userId: req.user?.id || null, email: req.user?.email || null });
  return res.json({ id: req.user.id, email: req.user.email });
}

function mask(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const copy = { ...obj };
  if ('password' in copy) copy.password = '****';
  return copy;
}

module.exports = { signup, login, logout, me };
