import Fuse from 'fuse.js';
import { UnitData, SearchFilters } from '@/types';

const fuseOptions: Fuse.IFuseOptions<UnitData> = {
  keys: [
    { name: 'name', weight: 0.3 },
    { name: 'nameReading', weight: 0.3 },
    { name: 'nameEnglish', weight: 0.2 },
    { name: 'members.name', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
    { name: 'description', weight: 0.05 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
};

export class UnitSearchEngine {
  private fuse: Fuse<UnitData>;

  constructor(units: UnitData[]) {
    this.fuse = new Fuse(units, fuseOptions);
  }

  search(query: string): UnitData[] {
    if (!query.trim()) return [];
    
    const results = this.fuse.search(query);
    return results.map(result => result.item);
  }

  filter(units: UnitData[], filters: SearchFilters): UnitData[] {
    return units.filter(unit => {
      // Member count filter
      if (filters.memberCount?.length && !filters.memberCount.includes(unit.memberCount)) {
        return false;
      }

      // Category filter
      if (filters.category?.length && !filters.category.includes(unit.category)) {
        return false;
      }

      // Status filter
      if (filters.status?.length && !filters.status.includes(unit.status)) {
        return false;
      }

      // Branch filter
      if (filters.branch?.length) {
        const hasMatchingBranch = unit.members.some(member => 
          filters.branch!.includes(member.branch)
        );
        if (!hasMatchingBranch) return false;
      }

      // Tags filter
      if (filters.tags?.length) {
        const hasMatchingTag = filters.tags.some(tag => 
          unit.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }

  searchAndFilter(units: UnitData[], query: string, filters: SearchFilters): UnitData[] {
    let filteredUnits = this.filter(units, filters);
    
    if (query.trim()) {
      // Update fuse instance with filtered units for search
      const searchFuse = new Fuse(filteredUnits, fuseOptions);
      const searchResults = searchFuse.search(query);
      return searchResults.map(result => result.item);
    }
    
    return filteredUnits;
  }
}