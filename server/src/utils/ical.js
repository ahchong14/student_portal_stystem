const buildICal = (courses) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Student Portal//EN'
  ];

  courses.forEach((course) => {
    lines.push('BEGIN:VEVENT');
    lines.push(`SUMMARY:${course.code} ${course.title}`);
    lines.push(`DESCRIPTION:${course.instructor}`);
    lines.push(`LOCATION:${course.timeslot}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\n');
};

module.exports = { buildICal };
