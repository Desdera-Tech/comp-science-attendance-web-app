import { prisma } from "@/lib/prisma";
import { passwordHash } from "@/utils/password";

async function main() {
  const hashedPassword = await passwordHash("password123");
  await prisma.user.create({
    data: {
      firstName: "Attendance",
      lastName: "Administrator",
      username: "admin@example.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Database seeded successfully with: 
    - 1 admin`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
