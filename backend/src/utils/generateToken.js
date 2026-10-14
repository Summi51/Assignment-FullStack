const jwt = require('jsonwebtoken');

const generateToken = (employee) => {
  return jwt.sign(
    { id: employee._id, email: employee.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
