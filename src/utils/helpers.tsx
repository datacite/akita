import { NumberFormat, toLocaleString } from '@formatjs/intl-numberformat';
NumberFormat.__addLocaleData(
  require('@formatjs/intl-numberformat/dist/locale-data/en.json') // locale-data for en
);

export const compactNumbers = (num) => {
  return toLocaleString(num, 'en', { notation: "compact" , compactDisplay: "short" })
}
