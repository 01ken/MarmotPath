import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedCourses: string[];
  addCompletedCourse: (courseId: string) => void;
  removeCompletedCourse: (courseId: string) => void;
  isCompleted: (courseId: string) => boolean;
  clearProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedCourses: [],

      addCompletedCourse: (courseId) =>
        set((state) => ({
          completedCourses: [...new Set([...state.completedCourses, courseId])],
        })),

      removeCompletedCourse: (courseId) =>
        set((state) => ({
          completedCourses: state.completedCourses.filter((id) => id !== courseId),
        })),

      isCompleted: (courseId) => {
        return get().completedCourses.includes(courseId);
      },

      clearProgress: () => set({ completedCourses: [] }),
    }),
    {
      name: 'marmot-progress-storage',
    }
  )
);
