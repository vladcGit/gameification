import { createContext } from 'react';
const ColorModeContext = createContext({ toggleColorMode: () => {} });

function formatDate(date) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '-' + mm + '-' + yyyy;
}

function formatDateWithHour(date) {
  const hh = date.getHours();
  let mm = date.getMinutes();
  if (mm === 0) mm = '00';
  return `${formatDate(date)} ${hh}:${mm}`;
}

export { ColorModeContext, formatDate, formatDateWithHour };
