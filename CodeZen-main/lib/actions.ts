"use server";
import { PrismaClient } from "@prisma/client";

// Simple and direct Prisma initialization for Vercel stability
const prisma = new PrismaClient();

export const getTestimonials = async () => {
  try {
    return await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Testimonials Error:", error);
    return [];
  }
};

export const createTestimonial = async (name: string, email: string, message: string) => {
  try {
    await prisma.testimonial.create({
      data: { name, email, message },
    });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    throw new Error("Failed to save testimonial.");
  }
};

export const checkEnrollment = async (userId: string, courseId: string) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!enrollment) return { isEnrolled: false };

    const isExpired = new Date() > new Date(enrollment.validUntil);
    return { 
      isEnrolled: !isExpired, 
      validUntil: enrollment.validUntil,
      expired: isExpired 
    };
  } catch (error) {
    console.error("Check Enrollment Error:", error);
    return { isEnrolled: false, error: true };
  }
};

export const enrollUser = async (userId: string, courseId: string, paymentId?: string) => {
  try {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: {
        validUntil,
        paymentId: paymentId || null,
      },
      create: {
        userId,
        courseId,
        validUntil,
        paymentId: paymentId || null,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Enrollment logic error:", error);
    // Return a plain object with the error message to avoid Next.js digest masking
    return { 
      success: false, 
      error: error.message || "Database connection or schema error" 
    };
  }
};

