export const SCOOP_CONFIG = {
  small: {
    id: "small",
    name: "Small Scoop",
    itemCount: "5-6",
    minItems: 5,
    maxItems: 6,
    price: 800,
    pricing: {
      1: 800,
      2: 1550,
      3: 2300,
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
    price: 1300,
    pricing: {
      1: 1300,
      2: 2500,
      3: 3650,
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
    price: 1600,
    pricing: {
      1: 1600,
      2: 3000,
      3: 4300,
    },
    description:
      "Go all in! A generous bundle of surprises you'll absolutely adore.",
    popular: false,
  },
};

function getProductRetailPrice(product) {
  const secondaryPrice = product?.secondaryPrice || 0;
  const price = product?.price || 0;
  const isSale = secondaryPrice > 0 && secondaryPrice > price;
  return isSale ? price : secondaryPrice || price;
}

function getTotalRetail(products) {
  return products.reduce((sum, p) => sum + getProductRetailPrice(p), 0);
}

export function getRandomProducts(allProducts, count, minTotalPrice = 0) {
  if (!allProducts || allProducts.length === 0) return [];

  const shuffled = [...allProducts].sort(() => Math.random() - 0.5);

  let selected = shuffled.slice(0, Math.min(count, shuffled.length));

  if (shuffled.length < count) {
    while (selected.length < count) {
      const randomIndex = Math.floor(Math.random() * shuffled.length);
      selected.push({ ...shuffled[randomIndex], _duplicate: true });
    }
  }

  if (minTotalPrice > 0 && getTotalRetail(selected) < minTotalPrice) {
    const remaining = shuffled.slice(count);
    for (let i = 0; i < remaining.length && getTotalRetail(selected) < minTotalPrice; i++) {
      const cheapest = selected.reduce((minIdx, p, idx) => {
        return getProductRetailPrice(p) < getProductRetailPrice(selected[minIdx]) ? idx : minIdx;
      }, 0);
      if (getProductRetailPrice(remaining[i]) > getProductRetailPrice(selected[cheapest])) {
        selected[cheapest] = remaining[i];
      }
    }
  }

  return selected;
}
