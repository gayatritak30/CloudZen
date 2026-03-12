"use client";

import Link from "next/link";
import { useCourses } from "@/hooks/use-courses";
import { useUser } from "@/context/user-context";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Award, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { checkEnrollment } from "@/lib/actions";

export default function CoursesPage() {
  const { courses, isLoading } = useCourses();
  const { user, getCourseProgress } = useUser();
  const { openSignIn } = useClerk();
  const { userId, isSignedIn } = useAuth();
  const [loadingCourse, setLoadingCourse] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (userId && courses.length > 0) {
        try {
          // Optimization: Check each course against the DB
          const enr: string[] = [];
          for (const course of courses) {
            const res = await checkEnrollment(userId, course.id);
            if (res.isEnrolled) enr.push(course.id);
          }
          setEnrolledCourses(enr);
        } catch (err) {
          console.error("Failed to fetch enrollments:", err);
        }
      }
    };
    if (!isLoading) fetchEnrollments();
  }, [userId, courses, isLoading]);

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.includes(courseId);
  };

  const handleEnroll = async (course: any) => {
    if (!isSignedIn || !userId) {
      toast.error("Please log in first to enroll in this course!");
      openSignIn();
      return;
    }

    if (isEnrolled(course.id)) {
      window.location.href = `/courses/${course.id}`;
      return;
    }

    setLoadingCourse(course.id);
    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Keeping a standard premium course amount for example
          items: [{ name: course.title + " Course", amount: 3200 }], 
          currency: "inr",
          courseId: course.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Enrollment failed", error);
      toast.error(error.message || "Failed to initiate payment.");
    } finally {
      setLoadingCourse(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 bg-white text-black">
        <h1 className="text-3xl font-bold">All Courses</h1>
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card
              key={i}
              className="h-[300px] bg-white border-muted/20 text-black transition-all group"
            >
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-primary text-white" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-primary text-white" />
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 space-y-8 max-w-6xl mx-auto py-15 bg-white text-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-2 text-center w-full">
              Explore All Courses
            </h1>
            <p className="text-muted-foreground text-center w-full">
              Start your journey with beginner-friendly courses in 10
              programming languages.
            </p>
          </div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {courses.map((course) => {
            return (
              <motion.div
                key={course.id}
                initial={{
                  filter: "blur(2px)",
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  filter: "blur(0px)",
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Card className="flex flex-col h-full bg-white border-muted/20 text-black transition-all group">
                  <CardHeader className="relative pb-0">
                    <div className="flex items-center justify-between mb-2 aspect-square relative">
                      <Image src={course.thumbnail} alt={course.title} fill />
                    </div>
                    <CardTitle className="text-xl text-black transition-colors">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pt-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {course.difficulty}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Certificate
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full" 
                      variant={"default"}
                      disabled={loadingCourse === course.id}
                      onClick={() => handleEnroll(course)}
                    >
                      {loadingCourse === course.id 
                        ? "Processing..." 
                        : isEnrolled(course.id) 
                          ? "Course Enrolled - View Details" 
                          : "Enroll Now"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
