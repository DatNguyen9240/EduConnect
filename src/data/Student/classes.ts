import type { Class } from '@/types/student';

export const mockClasses: Class[] = [
  // Khối 10
  { id: '10A1', name: '10A1', grade: 10, section: 'A' },
  { id: '10A2', name: '10A2', grade: 10, section: 'A' },
  { id: '10A3', name: '10A3', grade: 10, section: 'A' },
  { id: '10A4', name: '10A4', grade: 10, section: 'A' },
  { id: '10B1', name: '10B1', grade: 10, section: 'B' },
  { id: '10B2', name: '10B2', grade: 10, section: 'B' },

  // Khối 11
  { id: '11A1', name: '11A1', grade: 11, section: 'A' },
  { id: '11A2', name: '11A2', grade: 11, section: 'A' },
  { id: '11A3', name: '11A3', grade: 11, section: 'A' },
  { id: '11A4', name: '11A4', grade: 11, section: 'A' },
  { id: '11B1', name: '11B1', grade: 11, section: 'B' },
  { id: '11B2', name: '11B2', grade: 11, section: 'B' },

  // Khối 12
  { id: '12A1', name: '12A1', grade: 12, section: 'A' },
  { id: '12A2', name: '12A2', grade: 12, section: 'A' },
  { id: '12A3', name: '12A3', grade: 12, section: 'A' },
  { id: '12A4', name: '12A4', grade: 12, section: 'A' },
  { id: '12B1', name: '12B1', grade: 12, section: 'B' },
  { id: '12B2', name: '12B2', grade: 12, section: 'B' },
];

export const getClassesByGrade = (grade: number): Class[] => {
  return mockClasses.filter((cls) => cls.grade === grade);
};

export const getClassName = (classId: string): string => {
  return mockClasses.find((cls) => cls.id === classId)?.name || classId;
};
