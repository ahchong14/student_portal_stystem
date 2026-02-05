const gradeMap = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0
};

const calculateGpa = (grades) => {
  const validGrades = grades.filter((grade) => gradeMap[grade]);
  if (validGrades.length === 0) {
    return 0;
  }
  const total = validGrades.reduce((sum, grade) => sum + gradeMap[grade], 0);
  return Number((total / validGrades.length).toFixed(2));
};

module.exports = { calculateGpa };
