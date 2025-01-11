const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const postComments = await prisma.postComment.findMany({ select: { id: true } });
    const users = await prisma.user.findMany({ select: { id: true } });

    const data = [
      { commentId: postComments[0].id, userId: users[0].id, reaction: 'Heart' },
      { commentId: postComments[0].id, userId: users[1].id, reaction: 'Like' },
      { commentId: postComments[1].id, userId: users[2].id, reaction: 'Like' },
      { commentId: postComments[2].id, userId: users[0].id, reaction: 'Dislike' },
      { commentId: postComments[3].id, userId: users[1].id, reaction: 'Anger' },
      { commentId: postComments[5].id, userId: users[2].id, reaction: 'Crying' },
      { commentId: postComments[5].id, userId: users[3].id, reaction: 'Anger' },
      { commentId: postComments[7].id, userId: users[3].id, reaction: 'Like' },
      { commentId: postComments[9].id, userId: users[3].id, reaction: 'Laugh' },
      { commentId: postComments[9].id, userId: users[4].id, reaction: 'Heart' },
    ];

    await prisma.postCommentReaction.createMany({ data });
  },

  async down() {
    await prisma.postCommentReaction.deleteMany();
  },
};
