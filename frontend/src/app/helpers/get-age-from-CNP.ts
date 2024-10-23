import { DIGITS_ONLY_PATTERN } from '@patterns';

const getAge = (birthDateObj: Date): number => {
  const year = new Date().getFullYear() - birthDateObj.getFullYear();
  return new Date().getMonth() > birthDateObj.getMonth()
    ? year
    : new Date().getMonth() < birthDateObj.getMonth()
    ? year - 1
    : new Date().getDate() >= birthDateObj.getDate()
    ? year
    : year - 1;
};

const getPersonFullYear = (
  centuryDigit: number,
  personYearLastDigits: number
): number => {
  if (centuryDigit === 1 || centuryDigit === 2) {
    return 1900 + personYearLastDigits;
  } else if (centuryDigit === 3 || centuryDigit === 4) {
    return 1800 + personYearLastDigits;
  } else if (centuryDigit === 5 || centuryDigit === 6) {
    return 2000 + personYearLastDigits;
  } else {
    return null;
  }
};

export const getAgeFromCNP = (CNP: string): number => {
  if (!DIGITS_ONLY_PATTERN.test(CNP)) {
    return null;
  }
  if (CNP.length !== 13) {
    return null;
  }
  const centuryDigit = +CNP.slice(0, 1);
  const personYearLastDigits: number = +CNP.slice(1, 3);
  const personYear = getPersonFullYear(centuryDigit, personYearLastDigits);

  const personMonth: number = +CNP.slice(3, 5);
  const personDay: number = +CNP.slice(5, 7);
  if (!personMonth || personMonth > 12) {
    return null;
  }

  if (!personDay || personDay > 31) {
    return null;
  }

  const birthDate = new Date(personYear, personMonth - 1, personDay);

  if (
    birthDate.getFullYear() !== personYear ||
    birthDate.getMonth() !== personMonth - 1 ||
    birthDate.getDate() !== personDay
  ) {
    return null;
  }

  const age = getAge(birthDate);

  return age;
};
