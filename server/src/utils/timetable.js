const parseTimeslot = (timeslot) => {
  const [day, timeRange] = timeslot.split(' ');
  const [start, end] = timeRange.split('-');
  return { day, start, end };
};

const hasConflict = (existingSlots, newSlot) => {
  const newParsed = parseTimeslot(newSlot);
  return existingSlots.some((slot) => {
    const parsed = parseTimeslot(slot);
    if (parsed.day !== newParsed.day) {
      return false;
    }
    return !(newParsed.end <= parsed.start || newParsed.start >= parsed.end);
  });
};

module.exports = { parseTimeslot, hasConflict };
