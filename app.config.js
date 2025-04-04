export default () => ({
    expo: {
      name: 'black_box',
      slug: 'black_box',
      extra: {
        API_URL: process.env.API_URL || 'http://localhost:3000/api',
      },
    },
  });
  