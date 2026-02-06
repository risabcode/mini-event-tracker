// utils/logger.js
const maskSensitive = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const copy = { ...obj };
  if ('password' in copy) copy.password = '****';
  if ('token' in copy) copy.token = '****';
  return copy;
};

const formatMeta = (meta) => {
  try {
    if (!meta) return '';
    if (meta.body) meta.body = maskSensitive(meta.body);
    return ` | meta=${JSON.stringify(meta)}`;
  } catch (e) {
    return ` | meta=[unserializable]`;
  }
};

const log = (level, message, meta) => {
  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${level.toUpperCase()}]`;
  const metaText = formatMeta(meta);
  if (level === 'error') console.error(`${prefix} ${message}${metaText}`);
  else if (level === 'warn') console.warn(`${prefix} ${message}${metaText}`);
  else if (level === 'debug') console.debug(`${prefix} ${message}${metaText}`);
  else console.log(`${prefix} ${message}${metaText}`);
};

module.exports = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  debug: (message, meta) => log('debug', message, meta),
};
