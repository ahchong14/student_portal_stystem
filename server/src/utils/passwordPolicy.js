const validatePasswordPolicy = (password) => {
  const lengthOk = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  return lengthOk && hasUpper && hasLower && hasDigit;
};

module.exports = { validatePasswordPolicy };
