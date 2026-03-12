const { Client } = require('pg');
const client = new Client({
  connectionString: "postgres://22370e60978fcfca0e14d85a58c2d5a883f5b17084815839b11d1a8920a89f11:sk_I8h78UyDEiGhZFvm-Xux7@db.prisma.io:5432/postgres?sslmode=require",
});

async function run() {
  await client.connect();
  console.log("Connected successfully");
  const res = await client.query('CREATE TABLE IF NOT EXISTS "Enrollment" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "validUntil" TIMESTAMP(3) NOT NULL, "paymentId" TEXT, CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id"));');
  console.log("Table Enrollment created/verified");
  await client.query('CREATE UNIQUE INDEX IF NOT EXISTS "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");');
  await client.query('CREATE INDEX IF NOT EXISTS "Enrollment_userId_idx" ON "Enrollment"("userId");');
  console.log("Indexes created/verified");
  await client.end();
}

run().catch(console.error);
