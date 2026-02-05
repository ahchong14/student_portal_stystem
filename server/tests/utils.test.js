const { validatePasswordPolicy } = require('../src/utils/passwordPolicy');
const { calculateGpa } = require('../src/utils/gpa');

test('password policy enforces mixed case and digits', () => {
  expect(validatePasswordPolicy('Short1')).toBe(false);
  expect(validatePasswordPolicy('GoodPass1')).toBe(true);
});

test('gpa calculation averages grades', () => {
  expect(calculateGpa(['A', 'B'])).toBe(3.5);
});
