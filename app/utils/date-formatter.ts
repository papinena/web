import {
  format as formatFns,
  formatDistanceToNow as formatDistanceToNowFns,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * A utility class for formatting dates using date-fns.
 * This class provides static methods that wrap common date-fns functions,
 * ensuring consistent locale and formatting options across the application.
 */
export class DateFormatter {
  /**
   * Formats a date string or Date object into a specified format.
   * Defaults to the "dd/MM/yyyy" format.
   * @param date - The date to format (ISO string or Date object).
   * @param formatStr - The desired output format string.
   * @returns The formatted date string.
   */
  static format(
    date: string | Date,
    formatStr: string = "dd/MM/yyyy"
  ): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatFns(dateObj, formatStr, { locale: ptBR });
  }

  /**
   * Returns the distance between the given date and now in words.
   * Example: "há 5 dias"
   * @param date - The date to compare (ISO string or Date object).
   * @returns A string representing the distance to now.
   */
  static formatDistanceToNow(date: string | Date): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNowFns(dateObj, { addSuffix: true, locale: ptBR });
  }
}
