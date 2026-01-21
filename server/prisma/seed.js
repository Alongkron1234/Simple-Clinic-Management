const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('กำลังเริ่มเติมข้อมูล (Seeding)...');

  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();

  // 2. สร้างข้อมูลหมอ (Doctors)
  const doc1 = await prisma.doctor.create({
    data: {
      firstname: 'สมชาย',
      lastname: 'รักษ์ดี',
      phone: '0812223333',
      email: 'somchai@clinic.com',
      password: 'password123', 
      profile_img: null, // แก้จาก image เป็น profile_img
    },
  });

  const doc2 = await prisma.doctor.create({
    data: {
      firstname: 'สมหญิง',
      lastname: 'เก่งกาจ',
      phone: '0894445555',
      email: 'somying@clinic.com',
      password: 'password123',
      profile_img: null, // แก้จาก image เป็น profile_img
    },
  });

  // 3. สร้างข้อมูลคนไข้ (Patients)
  const pa1 = await prisma.patient.create({
    data: {
      firstname: 'ใจดี',
      lastname: 'มานะ',
      phone: '0991112222',
      email: 'jaidee@mail.com',
      password: 'password123',
      profile_img: null, // แก้จาก image เป็น profile_img
    },
  });

  // 4. สร้างการนัดหมาย
  await prisma.appointment.createMany({
    data: [
      {
        doc_id: doc1.doc_id,
        pa_id: pa1.pa_id,
        appointmentDate: new Date('2026-01-20T10:00:00Z'),
        status: 'pending',
      },
      {
        doc_id: doc2.doc_id,
        pa_id: pa1.pa_id,
        appointmentDate: new Date('2026-01-21T14:30:00Z'),
        status: 'confirmed',
      },
    ],
  });

  console.log('เติมข้อมูลสำเร็จเรียบร้อย!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });