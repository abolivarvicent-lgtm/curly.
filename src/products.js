// Curated product data, organized by brand. Each product is tagged with:
// - category: matches an ACTIVITIES id in App.jsx (shampoo, cowash, conditioner, etc.)
// - curlTypes: broad groups this product suits — '2' (wavy), '3' (curly), '4' (coily)
// - image: optional URL. If you add real product photos later (your own hosted
//   images), just fill this in — the UI falls back to a colored icon card when null.

export const BRANDS = [
  { id: "sheamoisture", name: "SheaMoisture", color: "#7A9B5C" },
  { id: "cantu", name: "Cantu", color: "#C4472B" },
  { id: "asiam", name: "As I Am", color: "#2F6E68" },
  { id: "mielle", name: "Mielle Organics", color: "#8B5A2B" },
  { id: "camillerose", name: "Camille Rose", color: "#B8722A" },
  { id: "curls", name: "Curls", color: "#9B5C8F" },
  { id: "devacurl", name: "DevaCurl", color: "#3D5A80" },
  { id: "auntjackies", name: "Aunt Jackie's", color: "#C97B84" },
];

export const PRODUCTS = [
  // SheaMoisture
  { id: "sm-1", brand: "sheamoisture", name: "Coconut & Hibiscus Curl & Shine Shampoo", category: "shampoo", curlTypes: ["3", "4"] },
  { id: "sm-2", brand: "sheamoisture", name: "Coconut & Hibiscus Curl & Shine Conditioner", category: "conditioner", curlTypes: ["3", "4"] },
  { id: "sm-3", brand: "sheamoisture", name: "Curl Enhancing Smoothie", category: "styler", curlTypes: ["3", "4"] },
  { id: "sm-4", brand: "sheamoisture", name: "Manuka Honey & Yogurt Hydrate + Repair Masque", category: "deepcondition", curlTypes: ["3", "4"] },
  { id: "sm-5", brand: "sheamoisture", name: "Jamaican Black Castor Oil Strengthen & Restore Leave-In", category: "leavein", curlTypes: ["4"] },

  // Cantu
  { id: "ct-1", brand: "cantu", name: "Shea Butter Sulfate-Free Cleansing Cream Shampoo", category: "shampoo", curlTypes: ["3", "4"] },
  { id: "ct-2", brand: "cantu", name: "Shea Butter Hydrating Cream Conditioner", category: "conditioner", curlTypes: ["2", "3", "4"] },
  { id: "ct-3", brand: "cantu", name: "Coconut Curling Cream", category: "styler", curlTypes: ["2", "3"] },
  { id: "ct-4", brand: "cantu", name: "Shea Butter Deep Treatment Masque", category: "deepcondition", curlTypes: ["3", "4"] },
  { id: "ct-5", brand: "cantu", name: "Coconut Oil Shine & Hold Mist", category: "styler", curlTypes: ["3", "4"] },

  // As I Am
  { id: "aia-1", brand: "asiam", name: "Coconut CoWash Cleansing Conditioner", category: "cowash", curlTypes: ["3", "4"] },
  { id: "aia-2", brand: "asiam", name: "Curling Jelly", category: "styler", curlTypes: ["3", "4"] },
  { id: "aia-3", brand: "asiam", name: "Leave-In Conditioner", category: "leavein", curlTypes: ["2", "3", "4"] },
  { id: "aia-4", brand: "asiam", name: "Hydration Elation Deep Conditioner", category: "deepcondition", curlTypes: ["3", "4"] },
  { id: "aia-5", brand: "asiam", name: "Twist Defining Cream", category: "styler", curlTypes: ["4"] },

  // Mielle Organics
  { id: "ml-1", brand: "mielle", name: "Rosemary Mint Strengthening Shampoo", category: "shampoo", curlTypes: ["2", "3", "4"] },
  { id: "ml-2", brand: "mielle", name: "Babassu Oil & Mint Deep Conditioner", category: "deepcondition", curlTypes: ["3", "4"] },
  { id: "ml-3", brand: "mielle", name: "Pomegranate & Honey Leave-In Conditioner", category: "leavein", curlTypes: ["2", "3", "4"] },
  { id: "ml-4", brand: "mielle", name: "Mongongo Oil Twisting Souffle", category: "styler", curlTypes: ["4"] },
  { id: "ml-5", brand: "mielle", name: "Rosemary Mint Scalp & Strengthening Hair Oil", category: "oil", curlTypes: ["2", "3", "4"] },

  // Camille Rose
  { id: "cr-1", brand: "camillerose", name: "Sweet Ginger Cleansing Rinse", category: "cowash", curlTypes: ["3", "4"] },
  { id: "cr-2", brand: "camillerose", name: "Curl Love Moisture Milk", category: "conditioner", curlTypes: ["2", "3"] },
  { id: "cr-3", brand: "camillerose", name: "Curl Maker", category: "styler", curlTypes: ["3", "4"] },
  { id: "cr-4", brand: "camillerose", name: "Honey Butter Curl Enhancing Butter", category: "styler", curlTypes: ["4"] },

  // Curls
  { id: "cu-1", brand: "curls", name: "Blueberry Bliss Reparative Leave-In", category: "leavein", curlTypes: ["3", "4"] },
  { id: "cu-2", brand: "curls", name: "Goldilocks Coil Jam", category: "styler", curlTypes: ["4"] },
  { id: "cu-3", brand: "curls", name: "Unrefined Black Jamaican Castor Oil", category: "oil", curlTypes: ["3", "4"] },
  { id: "cu-4", brand: "curls", name: "Coconut Sugar Cream Deep Conditioner", category: "deepcondition", curlTypes: ["3", "4"] },

  // DevaCurl
  { id: "dc-1", brand: "devacurl", name: "No-Poo Original Cleanser", category: "shampoo", curlTypes: ["2", "3"] },
  { id: "dc-2", brand: "devacurl", name: "One Condition Original", category: "conditioner", curlTypes: ["2", "3"] },
  { id: "dc-3", brand: "devacurl", name: "Styling Cream", category: "styler", curlTypes: ["2", "3"] },
  { id: "dc-4", brand: "devacurl", name: "Heaven in Hair Ultra Moisturizing Mask", category: "deepcondition", curlTypes: ["2", "3"] },

  // Aunt Jackie's
  { id: "aj-1", brand: "auntjackies", name: "Curls & Coils Curl La La Curl Defining Custard", category: "styler", curlTypes: ["3", "4"] },
  { id: "aj-2", brand: "auntjackies", name: "Quench Moisture Intensive Leave-In Conditioner", category: "leavein", curlTypes: ["3", "4"] },
  { id: "aj-3", brand: "auntjackies", name: "Don't Shrink Flaxseed Elongating Curling Gel", category: "styler", curlTypes: ["4"] },
  { id: "aj-4", brand: "auntjackies", name: "Girls With Curls Curl Cream", category: "styler", curlTypes: ["3"] },
];

// Broad curl group from a curl-chart id like "3B" -> "3"
export function curlGroup(hairTypeId) {
  return hairTypeId ? hairTypeId.charAt(0) : null;
}

export function productsForCategory(category) {
  return PRODUCTS.filter((p) => p.category === category);
}

export function recommendedProducts(hairTypeId, limit = 6) {
  const group = curlGroup(hairTypeId);
  if (!group) return [];
  return PRODUCTS.filter((p) => p.curlTypes.includes(group)).slice(0, limit);
}

export function brandById(id) {
  return BRANDS.find((b) => b.id === id);
}
