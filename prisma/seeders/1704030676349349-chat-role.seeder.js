const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const data = [{ name: 'User' }, { name: 'Moderator' }, { name: 'Administrator' }];

    await prisma.chatRole.createMany({ data });
  },

  async down() {
    await prisma.chatRole.deleteMany();
  },
};
