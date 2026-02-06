const prisma = require('../db');
const generatePublicId = require('../utils/generatePublicId');
const logger = require('../utils/logger');

function parseDateTime(dt) {
  const d = new Date(dt);
  if (isNaN(d)) return null;
  return d;
}

async function createEvent(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  logger.info('CreateEvent attempt', { ip, userId: req.user?.id, body: mask(req.body) });

  try {
    const { title, dateTime, location, description, sharePublic } = req.body;
    if (!title || !dateTime || !location) {
      logger.warn('CreateEvent validation failed: missing fields', { userId: req.user?.id, body: mask(req.body) });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const dt = parseDateTime(dateTime);
    if (!dt) {
      logger.warn('CreateEvent validation failed: invalid date', { userId: req.user?.id, dateTime });
      return res.status(400).json({ message: 'Invalid dateTime' });
    }

    const data = { title, dateTime: dt, location, description: description || '', userId: req.user.id };
    if (sharePublic) data.publicId = generatePublicId();

    const event = await prisma.event.create({ data });
    logger.info('Event created', { userId: req.user.id, eventId: event.id, title: event.title, publicId: data.publicId || null });
    res.status(201).json(event);
  } catch (err) {
    logger.error('CreateEvent error', { err: err?.stack || err?.message || err, userId: req.user?.id });
    res.status(500).json({ message: 'Server error' });
  }
}

async function listEvents(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  const filter = req.query.filter || 'upcoming';
  logger.info('ListEvents requested', { ip, userId: req.user?.id, filter });

  try {
    const now = new Date();
    let where = { userId: req.user.id };
    if (filter === 'upcoming') where.dateTime = { gte: now };
    else if (filter === 'past') where.dateTime = { lt: now };

    const events = await prisma.event.findMany({ where, orderBy: { dateTime: 'asc' } });
    logger.info('ListEvents response', { userId: req.user.id, count: events.length, filter });
    res.json(events);
  } catch (err) {
    logger.error('ListEvents error', { err: err?.stack || err?.message || err, userId: req.user?.id });
    res.status(500).json({ message: 'Server error' });
  }
}

async function getEvent(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  const id = parseInt(req.params.id, 10);
  logger.info('GetEvent requested', { ip, userId: req.user?.id, eventId: id });

  try {
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ message: 'Not found' });
    if (event.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    logger.info('GetEvent success', { userId: req.user.id, eventId: id });
    res.json(event);
  } catch (err) {
    logger.error('GetEvent error', { err: err?.stack || err?.message || err, userId: req.user?.id });
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteEvent(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  const id = parseInt(req.params.id, 10);
  logger.info('DeleteEvent requested', { ip, userId: req.user?.id, eventId: id });

  try {
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ message: 'Not found' });
    if (event.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await prisma.event.delete({ where: { id } });
    logger.info('DeleteEvent success', { userId: req.user.id, eventId: id });
    res.status(204).send();
  } catch (err) {
    logger.error('DeleteEvent error', { err: err?.stack || err?.message || err, userId: req.user?.id });
    res.status(500).json({ message: 'Server error' });
  }
}

// ---------------------------
// PUBLIC EVENTS (no auth)
// ---------------------------
async function getPublicEvent(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  const publicId = req.params.publicId;
  logger.info('GetPublicEvent requested', { ip, publicId });

  try {
    const event = await prisma.event.findUnique({ where: { publicId } });
    if (!event) return res.status(404).json({ message: 'Not found' });

    const publicView = {
      id: event.id,
      title: event.title,
      dateTime: event.dateTime,
      location: event.location,
      description: event.description,
      createdAt: event.createdAt
    };

    logger.info('GetPublicEvent success', { publicId, eventId: event.id });
    res.json(publicView);
  } catch (err) {
    logger.error('GetPublicEvent error', { err: err?.stack || err?.message || err, publicId });
    res.status(500).json({ message: 'Server error' });
  }
}

// NEW: list all public events
async function getPublicEvents(req, res) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  logger.info('GetPublicEvents requested', { ip });

  try {
    const events = await prisma.event.findMany({
      where: { publicId: { not: null } }, // only events with publicId (shared publicly)
      orderBy: { dateTime: 'asc' },
      select: {
        id: true,
        title: true,
        dateTime: true,
        location: true,
        description: true,
        publicId: true
      }
    });

    logger.info('GetPublicEvents success', { count: events.length });
    res.json(events);
  } catch (err) {
    logger.error('GetPublicEvents error', { err: err?.stack || err?.message || err });
    res.status(500).json({ message: 'Server error' });
  }
}

// Utility: mask sensitive info
function mask(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const copy = { ...obj };
  if ('password' in copy) copy.password = '****';
  return copy;
}

module.exports = { 
  createEvent, 
  listEvents, 
  getEvent, 
  deleteEvent, 
  getPublicEvent, 
  getPublicEvents 
};
