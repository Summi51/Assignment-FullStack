const Employee = require('../models/Employee');
const generateToken = require('../utils/generateToken');

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existing = await Employee.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({ name, email, password });
    const token = generateToken(employee);

    res.status(201).json({ employee, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const employee = await Employee.findOne({ email: email.toLowerCase() });
    if (!employee || !(await employee.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(employee);
    res.status(200).json({ employee, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login };
