import { useState, useEffect } from 'react'
import { COURSES, type Course } from '@/lib/data'

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Simulate async data fetching
      setTimeout(() => {
        setCourses(COURSES)
        setIsLoading(false)
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses')
      setIsLoading(false)
    }
  }, [])

  const getCourseById = (id: string): Course | undefined => {
    return courses.find(course => course.id === id)
  }

  const getCoursesByLanguage = (language: string): Course[] => {
    return courses.filter(course => course.language.toLowerCase() === language.toLowerCase())
  }

  return {
    courses,
    isLoading,
    error,
    getCourseById,
    getCoursesByLanguage,
  }
}
