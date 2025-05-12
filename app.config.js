import 'dotenv/config';
export default () => ({
    expo: {
      name: 'black_box',
      slug: 'black_box',
      extra: {
        API_URL: process.env.API_URL || 'http://192.168.15.29:3000/api',
      },
    },
  });
  