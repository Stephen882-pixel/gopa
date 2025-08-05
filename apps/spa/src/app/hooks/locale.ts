import { addLocale } from "ttag";
import { enGB, fr } from "date-fns/locale";
import { format, toDate, toZonedTime } from "date-fns-tz";

import { useAppSelector } from "@src/app/redux/store";

import langEN from "@src/i18n/en_GB.po.json";
import langFR from "@src/i18n/fr.po.json";

addLocale(enGB.code, langEN);
addLocale(fr.code, langFR);


export function getLocale(locale: string) {
  if ( "fr" === locale ) {
    return fr;
  }
  return enGB;
}

// Convert the date string to something that can be used by the date pickers
export function asDate(value: string | Date) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try { return toZonedTime(toDate(value), timeZone); }
  catch(ignore) {
    console.warn(ignore);
    return null;
  }
}


export default function useLocale() {
  const profile = useAppSelector((state) => state.auth.profile);
  const locales = [{iso:"en", label:"English"}, {iso:"fr", label: "Français"}];
  const locale = getLocale(profile?.locale);

  // Format the date using a specified date format
  function formatDate(value: string | Date, fmt?: string) {
    if ( !String(value || "").trim() ) {
      return null;
    }
    fmt = "date" === fmt ? "MMMM do, yyyy" : fmt || "MMMM do, yyyy h:mmaaa";
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      return format(toZonedTime(toDate(value), timeZone), fmt, { timeZone, locale });
    }
    catch(ignore) {
      console.warn(ignore);
      return null;
    }
  }

  // Allow one to display currencies using the specified locale
  // https://code-boxx.com/format-number-currency-string-javascript/
  function formatCurrency(num: any, currency?: string) {
    return formatNumber(num, { style: "currency", currency: currency || "USD" });
  }

  // Allow one to display numbers using the specified locale
  function formatNumber(num: any, options?: Intl.NumberFormatOptions) {
    const n = parseFloat(num);
    return Intl.NumberFormat(locale.code, options).format(isNaN(n) ? 0 : n);
  }

  return { locale, locales, asDate, formatDate, formatCurrency, formatNumber } as const;
}
