const { nanoid } = require('nanoid');

function generatePublicId() {
  // 10 character unguessable id
  return nanoid(10);
}

module.exports = generatePublicId;
