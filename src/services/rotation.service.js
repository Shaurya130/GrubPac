const getRotatedContent = (contents) => {

  if (!contents.length) {
    return null;
  }

  const sortedContents = [...contents].sort(
    (a, b) =>
      a.schedules[0].rotationOrder -
      b.schedules[0].rotationOrder
  );

  // total duration
  const totalDuration = sortedContents.reduce(
    (sum, item) =>
      sum + item.schedules[0].duration,
    0
  );

  // current minute
  const currentMinute = Math.floor(
    Date.now() / 60000
  );

  // cycle position
  const cyclePosition =
    currentMinute % totalDuration;

  let accumulatedDuration = 0;

  for (const item of sortedContents) {
    accumulatedDuration +=
      item.schedules[0].duration;

    if (cyclePosition < accumulatedDuration) {
      return item;
    }
  }

  // fallback
  return sortedContents[0];
};

export default getRotatedContent;