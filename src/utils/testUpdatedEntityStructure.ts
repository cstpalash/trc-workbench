import { useEntitiesStore } from '@/stores/entitiesStore';
import { EntityType } from '@/types';

// Test the updated entity structure
export function testUpdatedEntityStructure() {
  const store = useEntitiesStore.getState();
  
  console.log('=== Updated Entity Structure Test ===');
  
  // Test Platform entities (should not have tags)
  const platforms = store.getEntitiesByType(EntityType.PLATFORM);
  console.log('Platforms:', platforms.map(p => ({ name: p.name, tag: p.tag })));
  
  // Test Product entities (should have storage or compute tags)
  const products = store.getEntitiesByType(EntityType.PRODUCT);
  console.log('Products:');
  products.forEach(product => {
    console.log(`  - ${product.name} (${product.tag || 'no tag'})`);
  });
  
  // Group products by tag
  const storageProducts = products.filter(p => p.tag === 'storage');
  const computeProducts = products.filter(p => p.tag === 'compute');
  
  console.log('Storage Products:', storageProducts.map(p => p.name));
  console.log('Compute Products:', computeProducts.map(p => p.name));
  
  return {
    platforms: platforms.length,
    storageProducts: storageProducts.length,
    computeProducts: computeProducts.length,
    totalProducts: products.length
  };
}