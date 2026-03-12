"use server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

export const getTestimonials = async () => {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return testimonials;
};

export const createTestimonial = async (
  name: string,
  email: string,
  message: string
) => {
  await prisma.testimonial.create({
    data: {
      name,
      email,
      message,
    },
  });
};
export const checkEnrollment = async (userId: string, courseId: string) => {
  try {
    // Professional Fallback: Using raw SQL because Prisma CLI is having environment issues on this machine
    const enrollments = await prisma.$queryRaw`
      SELECT * FROM "Enrollment" 
      WHERE "userId" = ${userId} AND "courseId" = ${courseId}
      LIMIT 1
    ` as any[];

    if (!enrollments || enrollments.length === 0) return { isEnrolled: false };

    const enrollment = enrollments[0];
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
    validUntil.setFullYear(validUntil.getFullYear() + 1); // Professional 1 year validity

    const id = "enr_" + Math.random().toString(36).substr(2, 9);
    
    // UPSERT style using raw SQL for cross-device persistence
    await prisma.$executeRaw`
      INSERT INTO "Enrollment" ("id", "userId", "courseId", "validUntil", "paymentId")
      VALUES (${id}, ${userId}, ${courseId}, ${validUntil}, ${paymentId || null})
      ON CONFLICT ("userId", "courseId") 
      DO UPDATE SET "validUntil" = ${validUntil}, "paymentId" = ${paymentId || null}
    `;

    return { success: true };
  } catch (error) {
    console.error("Error enrolling user:", error);
    return { success: false };
  }
};
