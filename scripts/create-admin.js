const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@zhhf.org';
  const plainPassword = 'adminpassword'; // Change this to a secure password

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: 'ZHHF Admin',
    },
  });

  console.log('✅ Admin user created successfully:');
  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });