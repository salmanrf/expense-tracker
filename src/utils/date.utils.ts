import * as dfns from 'date-fns';
import { InvalidDateFormatError } from 'src/constants/errors';

export function parseDateFromString(
  dateStr: string,
): [Date | null, Error | null] {
  try {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    ];

    if (datePatterns.every((reg) => !reg.test(dateStr))) {
      return [null, new InvalidDateFormatError()];
    }

    let date = dfns.parseISO(dateStr);

    // ? Parse ISO or RFC
    if (!dfns.isValid(date)) {
      date = dfns.parse(dateStr, 'dd/MM/yyyy', 0);
    }

    return [date, null];
  } catch (error) {
    return [null, new InvalidDateFormatError(error)];
  }
}
