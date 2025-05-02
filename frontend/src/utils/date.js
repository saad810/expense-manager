import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);

const getDateLabel = (dateString) => {
  const date = dayjs(dateString);
  const now = dayjs();

  if (date.isToday()) return 'Today';
  if (date.isYesterday()) return 'Yesterday';
  if (date.isSame(now.add(1, 'day'), 'day')) return 'Tomorrow';

  const startOfWeek = now.startOf('week');
  const endOfWeek = now.endOf('week');
  const startOfLastWeek = now.subtract(1, 'week').startOf('week');
  const endOfLastWeek = now.subtract(1, 'week').endOf('week');

  const startOfMonth = now.startOf('month');
  const endOfMonth = now.endOf('month');
  const startOfLastMonth = now.subtract(1, 'month').startOf('month');
  const endOfLastMonth = now.subtract(1, 'month').endOf('month');

  const startOfYear = now.startOf('year');
  const endOfYear = now.endOf('year');
  const startOfLastYear = now.subtract(1, 'year').startOf('year');
  const endOfLastYear = now.subtract(1, 'year').endOf('year');

  if (date.isSameOrAfter(startOfWeek) && date.isSameOrBefore(endOfWeek)) return 'This Week';
  if (date.isSameOrAfter(startOfLastWeek) && date.isSameOrBefore(endOfLastWeek)) return 'Last Week';

  if (date.isSameOrAfter(startOfMonth) && date.isSameOrBefore(endOfMonth)) return 'This Month';
  if (date.isSameOrAfter(startOfLastMonth) && date.isSameOrBefore(endOfLastMonth)) return 'Last Month';

  if (date.isSameOrAfter(startOfYear) && date.isSameOrBefore(endOfYear)) return 'This Year';
  if (date.isSameOrAfter(startOfLastYear) && date.isSameOrBefore(endOfLastYear)) return 'Last Year';

  return date.format('MMM D, YYYY'); // fallback
};


export default getDateLabel;
