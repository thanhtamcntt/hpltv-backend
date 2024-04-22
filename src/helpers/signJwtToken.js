const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

async function hashToken(user) {
  const serverKey = await fs.readFileSync(
    path.join(__dirname, '../../server.key'),
  );
  const token = await jwt.sign(
    { user: user, exp: Date.now() + 3600 * 1000 * 24 },
    serverKey,
    { algorithm: 'HS256' },
    { expiresIn: '3600 * 24' },
  );
  return token;
}

module.exports = hashToken;
