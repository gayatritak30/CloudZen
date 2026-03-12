"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedDate: string
  progress: any[] // added progress array to match dashboard usage
  totalCertificates: number
  streak: number
}

export interface CourseProgress {
  courseId: string
  completedLessons: string[]
  currentLesson: string
  progress: number
  lastAccessed: string
  testScore?: number
  testCompleted: boolean
  certificateIssued?: boolean
}

export interface Certificate {
  id: string
  courseId: string
  courseName: string
  userName: string
  issuedDate: string
  score: number
}

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  courseProgress: Record<string, CourseProgress>
  getCourseProgress: (courseId: string) => CourseProgress | undefined
  updateProgress: (courseId: string, lessonId: string) => void
  completeTest: (courseId: string, score: number) => void
  certificates: Certificate[]
  issueCertificate: (courseId: string, courseName?: string, score?: number) => void
  getCertificate: (courseId: string) => Certificate | undefined
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({})
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("codezen_user")
    const storedProgress = localStorage.getItem("codezen_progress")
    const storedCertificates = localStorage.getItem("codezen_certificates")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Create a default demo user
      const defaultUser: User = {
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@codezen.com",
        joinedDate: new Date().toISOString(),
        progress: [],
        totalCertificates: 0,
        streak: 1,
      }
      setUser(defaultUser)
      localStorage.setItem("codezen_user", JSON.stringify(defaultUser))
    }

    if (storedProgress) {
      setCourseProgress(JSON.parse(storedProgress))
    }

    if (storedCertificates) {
      setCertificates(JSON.parse(storedCertificates))
    }

    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded && user) {
      localStorage.setItem("codezen_user", JSON.stringify(user))
    }
  }, [user, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("codezen_progress", JSON.stringify(courseProgress))
      if (user) {
        const progressArray = Object.values(courseProgress)
        setUser((prev) => (prev ? { ...prev, progress: progressArray } : null))
      }
    }
  }, [courseProgress, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("codezen_certificates", JSON.stringify(certificates))
      if (user) {
        setUser((prev) => (prev ? { ...prev, totalCertificates: certificates.length } : null))
      }
    }
  }, [certificates, isLoaded])

  const login = async (email: string, password: string) => {
    const newUser: User = {
      id: "user-" + Date.now(),
      name: email.split("@")[0],
      email,
      joinedDate: new Date().toISOString(),
      progress: [],
      totalCertificates: 0,
      streak: 1,
    }
    setUser(newUser)
  }

  const logout = () => {
    setUser(null)
    setCourseProgress({})
    setCertificates([])
    localStorage.removeItem("codezen_user")
    localStorage.removeItem("codezen_progress")
    localStorage.removeItem("codezen_certificates")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const getCourseProgress = (courseId: string) => {
    return courseProgress[courseId]
  }

  const updateProgress = (courseId: string, lessonId: string) => {
    setCourseProgress((prev) => {
      const existing = prev[courseId] || {
        courseId,
        completedLessons: [],
        currentLesson: lessonId,
        progress: 0,
        lastAccessed: new Date().toISOString(),
        testCompleted: false,
      }

      const completedLessons = existing.completedLessons.includes(lessonId)
        ? existing.completedLessons
        : [...existing.completedLessons, lessonId]

      return {
        ...prev,
        [courseId]: {
          ...existing,
          completedLessons,
          currentLesson: lessonId,
          lastAccessed: new Date().toISOString(),
        },
      }
    })
  }

  const completeTest = (courseId: string, score: number) => {
    setCourseProgress((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        testScore: score,
        testCompleted: true,
        progress: 100,
      },
    }))
  }

  const issueCertificate = (courseId: string, courseName?: string, score?: number) => {
    const newCertificate: Certificate = {
      id: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      courseId,
      courseName: courseName || "Programming Course",
      userName: user?.name || "Student",
      issuedDate: new Date().toISOString(),
      score: score || 100,
    }

    setCertificates((prev) => {
      const existingIndex = prev.findIndex((cert) => cert.courseId === courseId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newCertificate
        return updated
      }
      return [...prev, newCertificate]
    })

    setCourseProgress((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        certificateIssued: true,
      },
    }))
  }

  const getCertificate = (courseId: string) => {
    return certificates.find((cert) => cert.courseId === courseId)
  }

  const value: UserContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    courseProgress,
    getCourseProgress,
    updateProgress,
    completeTest,
    certificates,
    issueCertificate,
    getCertificate,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
