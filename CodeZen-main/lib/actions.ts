"use server";
import { PrismaClient } from "@prisma/client";

// PrismaClient singleton to prevent too many connections in development
const globalForPrisma = global as unknown { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const getTestimonials = async () => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};

export const createTestimonial = async (
  name: string,
  email: string,
  message: string
) => {
  try {
    await prisma.testimonial.create({
      data: {
        name,
        email,
        message,
      },
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw new Error("Failed to create testimonial.");
  }
};

export const checkEnrollment = async (userId: string, courseId: string) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) return { isEnrolled: false };

    const isExpired = new Date() > new Date(enrollment.validUntil);
    
    if (isExpired) {
      return { isEnrolled: false, expired: true };
    }

    return { isEnrolled: true, validUntil: enrollment.validUntil };
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return { isEnrolled: false, error: true };
  }
};

export const enrollUser = async (userId: string, courseId: string, paymentId?: string) => {
  try {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    // Using Standard Prisma Upsert for multi-device reliability
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
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
  } catch (error) {
    console.error("Error enrolling user:", error);
    return { success: false };
  }
};
