const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ role: 'User' }, { role: 'Volunteer' }],
      },
      select: {
        id: true,
      },
    });

    const data = [
      {
        userId: users[2].id,
        dueTo: new Date('2024-10-09T12:14:41'),
        note: 'The use of profanity',
        permissionsPenalty: 3,
      },
      {
        userId: users[3].id,
        note: 'Publishing false publications for illegal fundraising',
        permissionsPenalty: 255,
      },
    ];

    await prisma.userPenalty.createMany({ data });
  },

  async down() {
    await prisma.userPenalty.deleteMany();
  },
};
