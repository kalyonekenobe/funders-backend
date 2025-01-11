const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const posts = await prisma.post.findMany({ select: { id: true } });
    const users = await prisma.user.findMany({ select: { id: true } });

    const data = [
      { userId: users[0].id, postId: posts[0].id, reaction: 'Like' },
      { userId: users[1].id, postId: posts[0].id, reaction: 'Like' },
      { userId: users[2].id, postId: posts[0].id, reaction: 'Like' },
      { userId: users[3].id, postId: posts[0].id, reaction: 'Like' },
      { userId: users[4].id, postId: posts[0].id, reaction: 'Like' },
      { userId: users[3].id, postId: posts[1].id, reaction: 'Like' },
      { userId: users[4].id, postId: posts[2].id, reaction: 'Like' },
      { userId: users[2].id, postId: posts[3].id, reaction: 'Like' },
      { userId: users[4].id, postId: posts[3].id, reaction: 'Like' },
      { userId: users[1].id, postId: posts[4].id, reaction: 'Like' },
    ];

    await prisma.postReaction.createMany({ data });
  },

  async down() {
    await prisma.postReaction.deleteMany();
  },
};
