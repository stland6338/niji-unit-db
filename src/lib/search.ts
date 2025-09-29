import Fuse from 'fuse.js';
import { UnitData, SearchFilters } from '@/types/unit';

const fuseOptions = {
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

export function searchUnits(units: UnitData[], filters: SearchFilters): UnitData[] {
  let result = [...units];

  // Apply filters first
  if (filters.category?.length) {
    result = result.filter(unit => filters.category!.includes(unit.category));
  }

  if (filters.status?.length) {
    result = result.filter(unit => filters.status!.includes(unit.status));
  }

  if (filters.branch?.length) {
    result = result.filter(unit => 
      unit.members.some(member => filters.branch!.includes(member.branch))
    );
  }

  if (filters.memberCount?.length) {
    result = result.filter(unit => filters.memberCount!.includes(unit.memberCount));
  }

  if (filters.tags?.length) {
    result = result.filter(unit => 
      filters.tags!.some(tag => unit.tags.includes(tag))
    );
  }

  // Apply text search if query exists
  if (filters.query?.trim()) {
    const fuse = new Fuse(result, fuseOptions);
    const searchResults = fuse.search(filters.query);
    result = searchResults.map(res => res.item);
  }

  return result;
}

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
    const filteredUnits = this.filter(units, filters);
    
    if (query.trim()) {
      // Update fuse instance with filtered units for search
      const searchFuse = new Fuse(filteredUnits, fuseOptions);
      const searchResults = searchFuse.search(query);
      return searchResults.map(result => result.item);
    }
    
    return filteredUnits;
  }
}