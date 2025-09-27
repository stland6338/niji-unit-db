export type Branch = 'jp' | 'en' | 'id' | 'kr' | 'ex';
export type UnitStatus = 'active' | 'inactive' | 'unknown';
export type UnitCategory = 'gaming' | 'music' | 'variety' | 'collaboration' | 'other';
export type Platform = 'youtube' | 'twitter' | 'discord' | 'other';
export type ActivityType = 'stream' | 'song' | 'event' | 'collab';
export type MemberStatus = 'active' | 'graduated' | 'hiatus';

export interface Member {
  name: string;
  nameReading?: string;
  generation?: string;
  branch: Branch;
  role?: string;
  joinDate?: string;
  status: MemberStatus;
}

export interface Activity {
  type: ActivityType;
  title: string;
  date: string;
  url?: string;
}

export interface UnitData {
  id: string;
  name: string;
  nameReading?: string;
  nameEnglish?: string;
  members: Member[];
  memberCount: number;
  
  category: UnitCategory;
  status: UnitStatus;
  description?: string;
  
  createdAt?: string;
  firstStream?: string;
  lastActivity?: string;
  
  activities?: Activity[];
  games?: string[];
  platforms?: Platform[];
  
  logo?: string;
  colors?: string[];
  hashtags?: string[];
  
  popularity?: number;
  relatedUnits?: string[];
  
  tags: string[];
  lastUpdated: string;
  sources: string[];
}

export interface SearchFilters {
  query?: string;
  memberCount?: number[];
  category?: UnitCategory[];
  status?: UnitStatus[];
  branch?: Branch[];
  tags?: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'name-to-members' | 'members-to-name' | 'member-count';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  unit: UnitData;
}