import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
//usuario de prueba para el seed
  const TEST_USER_ID = '981a3cbe-ca49-475d-a917-19d81ffedd08';

  console.log(`Start seeding for user: ${TEST_USER_ID}...`);

  const projects = [
    { name: 'Website Redesign', description: 'Rediseño del sitio corporativo', color: '#3B82F6' },
    { name: 'Mobile App MVP', description: 'App para iOS y Android', color: '#10B981' },
    { name: 'Marketing Campaign', description: 'Campaña Q3', color: '#F59E0B' },
  ];

  for (const p of projects) {
    const project = await prisma.project.create({
      data: {
        name: p.name,
        description: p.description,
        color: p.color,
        userId: TEST_USER_ID,
        tasks: {
          create: [
            { title: 'Task 1', description: 'Definir requerimientos', status: 'completed', priority: 'high', userId: TEST_USER_ID },
            { title: 'Task 2', description: 'Diseño de UI', status: 'in_progress', priority: 'medium', userId: TEST_USER_ID },
            { title: 'Task 3', description: 'Desarrollo frontend', status: 'pending', priority: 'high', userId: TEST_USER_ID },
            { title: 'Task 4', description: 'Integración de API', status: 'pending', priority: 'medium', userId: TEST_USER_ID },
            { title: 'Task 5', description: 'Testing final', status: 'pending', priority: 'low', userId: TEST_USER_ID },
          ],
        },
      },
    });
    console.log(`Created project with id: ${project.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });