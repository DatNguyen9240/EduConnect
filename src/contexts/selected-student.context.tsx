import { createContext, useContext, useState, useEffect } from 'react';
import { AppContext } from './app.context';
import type { Student } from '@/types/student';

export interface SelectedStudentContextType {
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  isLoaded: boolean;
}

const SelectedStudentContext = createContext<SelectedStudentContextType>({
  selectedStudent: null,
  setSelectedStudent: () => {},
  isLoaded: false,
});

export const useSelectedStudent = () => useContext(SelectedStudentContext);

export function SelectedStudentProvider({ children }: { children: React.ReactNode }) {
  const [selectedStudent, setSelectedStudentState] = useState<Student | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { userInfo } = useContext(AppContext);

  // Load từ localStorage khi mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedStudent');
    if (saved) setSelectedStudentState(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  // Lưu vào localStorage khi thay đổi
  const setSelectedStudent = (student: Student | null) => {
    setSelectedStudentState(student);
    if (student) {
      localStorage.setItem('selectedStudent', JSON.stringify(student));
    } else {
      localStorage.removeItem('selectedStudent');
    }
  };

  // Khi logout thì xóa selectedStudent
  useEffect(() => {
    if (!userInfo) {
      setSelectedStudentState(null);
      localStorage.removeItem('selectedStudent');
    }
  }, [userInfo]);

  return (
    <SelectedStudentContext.Provider value={{ selectedStudent, setSelectedStudent, isLoaded }}>
      {children}
    </SelectedStudentContext.Provider>
  );
}
