import productsData from '../data/products.json';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
  description?: string;
}

export function getRandomizedProducts(): ProductItem[] {
  const allProducts: ProductItem[] = [];
  
  // Extract products from the JSON structure
  Object.entries(productsData).forEach(([category, subcategories]) => {
    if (typeof subcategories === 'object' && subcategories !== null) {
      Object.entries(subcategories).forEach(([subcategory, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item: any, index: number) => {
            allProducts.push({
              id: `${category}-${subcategory}-${index}`,
              name: item.title || item.name || 'Unknown Product',
              price: item.price || 0,
              category: category,
              image: item.image,
              rating: item.rating,
              description: item.description
            });
          });
        }
      });
    }
  });

  // Shuffle the products
  const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
  
  // Get first 5 products from each category
  const categoryCounts: { [key: string]: number } = {};
  const selectedProducts: ProductItem[] = [];
  
  shuffled.forEach(product => {
    if (!categoryCounts[product.category]) {
      categoryCounts[product.category] = 0;
    }
    
    if (categoryCounts[product.category] < 5) {
      selectedProducts.push(product);
      categoryCounts[product.category]++;
    }
  });

  return selectedProducts;
} 