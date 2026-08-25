import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gestorgastos.com';

  // Verificar si el usuario admin ya existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrador Principal',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log('✅ Usuario ADMIN creado exitosamente (Email: admin@gestorgastos.com / Pass: Admin123!)');
  } else {
    console.log('ℹ️ El usuario ADMIN ya existe en la base de datos.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });