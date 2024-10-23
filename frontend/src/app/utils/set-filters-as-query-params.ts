const populateFiltersArray = (filtersArray: string[], filters: any): void => {
  for (const [key, value] of Object.entries(filters)) {
    if ((value || value === 0) && typeof value !== 'object') {
      filtersArray.push(`${key}=${value}`);
    } else if (value && typeof value === 'object') {
      populateFiltersArray(filtersArray, value);
    }
  }
};

export const setFiltersAsQueryParams = (filters: any): string => {
  if (filters) {
    // set an array of filters as string in queryParams format
    const filtersArray = [];
    populateFiltersArray(filtersArray, filters);
    // set the complete filterString by adding in start ? and joining the filter array with &
    return '?' + filtersArray.join('&');
  }
  return '';
};
