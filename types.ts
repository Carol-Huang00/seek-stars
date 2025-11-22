export enum Direction {
  EAST = '东方青龙',
  NORTH = '北方玄武',
  WEST = '西方白虎',
  SOUTH = '南方朱雀',
}

export interface ConstellationData {
  id: number;
  name: string; // e.g., 胃
  fullName: string; // e.g., 胃土彘
  animal: string; // e.g., 彘 (Pheasant/Pig representation)
  element: string; // e.g., 土
  direction: Direction;
  description: string; // Traditional concise description
  poem: string; // Classical poem
  fortune: string; // Pre-stored detailed interpretation (replacing AI)
  imageUrl: string; // Static asset URL
}

export interface UserRecord {
  birthDate: string; // YYYY-MM-DD
  constellationId: number;
  timestamp: number;
  // aiInterpretation removed as we now use static 'fortune' data
}

export const LOCAL_STORAGE_KEY = 'star_destiny_record_v2'; // Bumped version due to schema change