import { create } from 'zustand';
import { Entity, EntityType } from '@/types';

interface EntitiesState {
  entities: Entity[];
  
  // Actions
  getEntitiesByType: (type: EntityType) => Entity[];
  getEntityById: (id: string) => Entity | undefined;
  getAllEntities: () => Entity[];
  getEntityHierarchy: () => { [key: string]: Entity[] };
}

// Default entities based on your requirements
const defaultEntities: Entity[] = [
  // Platforms
  { id: 'platform-1', name: 'Atlas Core', type: EntityType.PLATFORM },
  { id: 'platform-2', name: 'Atlas Marketplace', type: EntityType.PLATFORM },
  
  // Products - Storage Type
  { id: 'product-1', name: 'AWS Aurora MySQL', type: EntityType.PRODUCT, tag: 'storage' },
  { id: 'product-2', name: 'AWS Aurora Postgres', type: EntityType.PRODUCT, tag: 'storage' },
  { id: 'product-3', name: 'AWS S3', type: EntityType.PRODUCT, tag: 'storage' },
  
  // Products - Compute Type  
  { id: 'product-4', name: 'AWS EC2', type: EntityType.PRODUCT, tag: 'compute' },
  { id: 'product-5', name: 'AWS ECS', type: EntityType.PRODUCT, tag: 'compute' },
];

export const useEntitiesStore = create<EntitiesState>((set, get) => ({
  entities: defaultEntities,
  
  getEntitiesByType: (type: EntityType) => {
    return get().entities.filter(entity => entity.type === type);
  },
  
  getEntityById: (id: string) => {
    return get().entities.find(entity => entity.id === id);
  },
  
  getAllEntities: () => {
    return get().entities;
  },
  
  getEntityHierarchy: () => {
    const entities = get().entities;
    const hierarchy: { [key: string]: Entity[] } = {};
    
    // Group by type
    Object.values(EntityType).forEach(type => {
      hierarchy[type] = entities.filter(entity => entity.type === type);
    });
    
    return hierarchy;
  }
}));