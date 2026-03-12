"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCourses } from "@/hooks/use-courses"
import { CoursePlayer } from "@/components/course-player"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { enrollUser } from "@/lib/actions"

export default function CourseLearnPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { userId } = useAuth()
  const { getCourseById, isLoading } = useCourses()
  const course = getCourseById(id as string)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const success = searchParams?.get("success")
    if (success === "true" && userId && id) {
      const verifyAndEnroll = async () => {
        setIsVerifying(true)
        try {
          const result = await enrollUser(userId, id as string)
          if (result.success) {
            toast.success("Payment successful! Course added to your profile across all devices.")
          } else {
            toast.error(result.error || "Handled payment but failed to sync enrollment. Please contact support.")
          }
        } catch (error: any) {
          console.error("Enrollment error:", error)
          toast.error(`Enrollment failed: ${error.message || "Unknown error"}`)
        } finally {
          setIsVerifying(false)
          // Always clean URL
          router.replace(`/courses/${id}`)
        }
      }
      verifyAndEnroll()
    }
  }, [searchParams, userId, id, router])

  if (isLoading || isVerifying) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <Button asChild>
          <Link href="/courses">Return to Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl my-15 mx-auto">

      <CoursePlayer course={course} />
    </div>
  )
}
