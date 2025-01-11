const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const posts = await prisma.post.findMany({ select: { id: true } });

    const data = [
      { postId: posts[0].id, details: JSON.stringify({ last4: '4242' }), amount: 1200 },
      { postId: posts[0].id, details: JSON.stringify({ last4: '5156' }), amount: 4495 },
      { postId: posts[0].id, details: JSON.stringify({ last4: '9615' }), amount: 300 },
      { postId: posts[1].id, details: JSON.stringify({ last4: '8146' }), amount: 45.98 },
      { postId: posts[2].id, details: JSON.stringify({ last4: '4242' }), amount: 5844.5 },
      { postId: posts[2].id, details: JSON.stringify({ last4: '9675' }), amount: 124.12 },
      { postId: posts[3].id, details: JSON.stringify({ last4: '5584' }), amount: 48591.5 },
      { postId: posts[4].id, details: JSON.stringify({ last4: '1145' }), amount: 583.4 },
      { postId: posts[4].id, details: JSON.stringify({ last4: '6431' }), amount: 888.33 },
    ];

    await prisma.postDonation.createMany({ data });
  },

  async down() {
    await prisma.postDonation.deleteMany();
  },
};
