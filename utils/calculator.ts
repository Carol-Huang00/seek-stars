import { CONSTELLATIONS, getConstellationByIndex } from '../services/constellationData';
import { ConstellationData } from '../types';

// Reference date: January 1, 2000 was 胃土彘 (Wei Tu Zhi)
// Wei is index 16 in our array.
const REF_DATE_STR = '2000-01-01';
const REF_INDEX = 16;

export const calculateConstellation = (dateStr: string): ConstellationData => {
  const targetDate = new Date(dateStr);
  const refDate = new Date(REF_DATE_STR);

  // Get difference in time
  const diffTime = targetDate.getTime() - refDate.getTime();
  
  // Convert to days. Math.floor is important for handling timezones safely if input is just YYYY-MM-DD
  // We treat input as UTC midnight effectively for day diff calculation
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate index
  // Formula: (RefIndex + (diffDays % 28) + 28) % 28
  const index = (REF_INDEX + (diffDays % 28) + 28) % 28;

  return getConstellationByIndex(index);
};