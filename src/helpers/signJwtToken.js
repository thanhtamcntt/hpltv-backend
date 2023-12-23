const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

async function hashToken(id) {
  const serverKey = await fs.readFileSync(
    path.join(__dirname, '../../server.key'),
  );
  const token = await jwt.sign(
    { id: id },
    serverKey,
    { algorithm: 'RS256' },
    { expiresIn: '1h' },
  );
  return token;
}

module.exports = hashToken;
