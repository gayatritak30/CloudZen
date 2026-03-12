import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Aarav Sharma",
        email: "aarav@example.com",
        message:
          "CodeZen helped me understand programming fundamentals clearly. The platform is clean and beginner-friendly.",
      },
      {
        name: "Priya Verma",
        email: "priya@example.com",
        message:
          "The integrated compiler and structured courses make learning extremely smooth and practical.",

      },
      {
        name: "Rohan Mehta",
        email: "rohan@example.com",
        message:
          "I loved the way CodeZen tracks progress and unlocks tests only after watching lessons properly.",

      },
      {
        name: "Sneha Kulkarni",
        email: "sneha@example.com",
        message:
          "Perfect platform for students who want theory + hands-on coding in one place.",
      },
      {
        name: "Aditya Patil",
        email: "aditya@example.com",
        message:
          "CodeZen feels like a modern coding academy. The UI, courses, and tests are very well designed.",
      },
    ],
  });

  console.log("✅ Testimonials seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
