"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserProgress {
  courseId: string
  completedLessons: string[]
  testPassed: boolean
}

interface UserStore {
  userName: string
  setUserName: (name: string) => void
  progress: Record<string, UserProgress>
  completeLesson: (courseId: string, lessonId: string) => void
  passTest: (courseId: string) => void
}

export const useStore = create<UserStore>()(
  persist(
    (set) => ({
      userName: "Guest Learner",
      setUserName: (name) => set({ userName: name }),
      progress: {},
      completeLesson: (courseId, lessonId) =>
        set((state) => {
          const courseProgress = state.progress[courseId] || { courseId, completedLessons: [], testPassed: false }
          if (courseProgress.completedLessons.includes(lessonId)) return state
          return {
            progress: {
              ...state.progress,
              [courseId]: {
                ...courseProgress,
                completedLessons: [...courseProgress.completedLessons, lessonId],
              },
            },
          }
        }),
      passTest: (courseId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [courseId]: {
              ...(state.progress[courseId] || { courseId, completedLessons: [], testPassed: false }),
              testPassed: true,
            },
          },
        })),
    }),
    {
      name: "codezen-storage",
    },
  ),
)
