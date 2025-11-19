import { useEntitiesStore } from '@/stores/entitiesStore';
import { EntityType } from '@/types';

// Test entity store functionality
export function testEntityAssociation() {
  const store = useEntitiesStore.getState();
  
  // Test getting entities by type
  console.log('Platform entities:', store.getEntitiesByType(EntityType.PLATFORM));
  console.log('Product entities:', store.getEntitiesByType(EntityType.PRODUCT));
  console.log('Application entities:', store.getEntitiesByType(EntityType.APPLICATION));
  
  // Test getting specific entity
  const entity = store.getEntityById('platform-atlas-core');
  console.log('Atlas Core Platform:', entity);
  
  return {
    platforms: store.getEntitiesByType(EntityType.PLATFORM),
    products: store.getEntitiesByType(EntityType.PRODUCT),
    applications: store.getEntitiesByType(EntityType.APPLICATION),
    totalEntities: store.getAllEntities().length
  };
}