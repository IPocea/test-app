export const getTaxFeeFromCylindricalCapacity = (
  cylindricalCapacity: number
): number => {
  if (!cylindricalCapacity || isNaN(+cylindricalCapacity)) {
    return null;
  }

  if (cylindricalCapacity < 1500) {
    return 50;
  } else if (cylindricalCapacity > 1500 && cylindricalCapacity < 2000) {
    return 100;
  } else if (cylindricalCapacity >= 2000 && cylindricalCapacity < 10000) {
    return 200;
  } else {
    return null;
  }
};
