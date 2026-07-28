export const calculateProductPrice = (product) => {
  const secondaryPrice = product?.secondaryPrice || 0;
  const price = product?.price || 0;

  const isSale = secondaryPrice > 0 && secondaryPrice > price;
  const displayPrice = isSale ? price : secondaryPrice || price;
  const oldPrice = isSale ? secondaryPrice : null;
  const discountPercentage = isSale
    ? Math.round(((secondaryPrice - price) / secondaryPrice) * 100)
    : 0;

  return {
    displayPrice,
    oldPrice,
    isSale,
    discountPercentage,
  };
};
