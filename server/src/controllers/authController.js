const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const { User, RefreshToken } = require('../models');
const { sendEmail } = require('../services/emailService');
const { validatePasswordPolicy } = require('../utils/passwordPolicy');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

const signTokens = async (user) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  await RefreshToken.create({ userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 86400000) });
  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, role = 'Student' } = req.body;
  if (!validatePasswordPolicy(password)) {
    return res.status(400).json({ message: 'Password does not meet policy requirements.' });
  }
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered.' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, role, isVerified: false });
  const verificationToken = uuidv4();
  await sendEmail({
    to: email,
    subject: 'Verify your Student Portal account',
    text: `Use this verification token: ${verificationToken}`
  });
  return res.status(201).json({ message: 'Registered. Check email for verification.', verificationToken, userId: user.id });
};

const verifyEmail = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.isVerified = true;
  await user.save();
  return res.json({ message: 'Email verified' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (!user.isVerified) {
    return res.status(403).json({ message: 'Email not verified' });
  }
  const tokens = await signTokens(user);
  return res.json({ ...tokens, user: { id: user.id, email: user.email, role: user.role, mfaEnabled: user.mfaEnabled } });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.json({ message: 'If the email exists, a reset link will be sent.' });
  }
  const resetToken = uuidv4();
  await sendEmail({ to: email, subject: 'Password Reset', text: `Reset token: ${resetToken}` });
  return res.json({ message: 'Reset email sent.', resetToken });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Missing refresh token' });
  }
  const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
  if (!stored) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const tokens = await signTokens(user);
    return res.json(tokens);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const enableMfa = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.mfaEnabled = true;
  await user.save();
  return res.json({ message: 'MFA enabled (stub)' });
};

const ssoStub = async (req, res) => {
  return res.json({
    message: 'SSO stub response',
    integrationPoints: {
      samlMetadataUrl: '/sso/saml/metadata',
      oauthAuthorizeUrl: '/sso/oauth/authorize'
    }
  });
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  refresh,
  enableMfa,
  ssoStub
};
