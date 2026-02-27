import { format, parseISO, isToday, isYesterday, differenceInDays } from 'date-fns';

export const todayDate = (): string => format(new Date(), 'yyyy-MM-dd');
export const nowIso = (): string => new Date().toISOString();

export function formatSessionDate(isoDate: string): string {
  const date = parseISO(isoDate);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  const days = differenceInDays(new Date(), date);
  if (days < 7) return format(date, 'EEEE');
  if (days < 365) return format(date, 'd MMM');
  return format(date, 'd MMM yyyy');
}

export function formatChartDate(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMM');
}
