export const SCOOP_CONFIG = {
  small: {
    id: "small",
    name: "Small Scoop",
    itemCount: "5-6",
    minItems: 5,
    maxItems: 6,
    price: 700,
    pricing: {
      1: 700,
      2: 1350,
      3: 2000,
    },
    description: "A curated handful of surprise goodies to brighten your day.",
    popular: false,
  },
  regular: {
    id: "regular",
    name: "Regular Scoop",
    itemCount: "8-10",
    minItems: 8,
    maxItems: 10,
    price: 1200,
    pricing: {
      1: 1200,
      2: 2300,
      3: 3350,
    },
    description:
      "Our most loved scoop - the perfect mix of treats and treasures.",
    popular: true,
  },
  large: {
    id: "large",
    name: "Large Scoop",
    itemCount: "12-14",
    minItems: 12,
    maxItems: 14,
    price: 1500,
    pricing: {
      1: 1500,
      2: 2800,
      3: 4000,
    },
    description:
      "Go all in! A generous bundle of surprises you'll absolutely adore.",
    popular: false,
  },
};

export function getRandomProducts(allProducts, count) {
  if (!allProducts || allProducts.length === 0) return [];

  const shuffled = [...allProducts].sort(() => Math.random() - 0.5);

  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }

  const result = [...shuffled];
  while (result.length < count) {
    const randomIndex = Math.floor(Math.random() * shuffled.length);
    result.push({ ...shuffled[randomIndex], _duplicate: true });
  }
  return result;
}
