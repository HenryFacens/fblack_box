import 'dotenv/config';
export default () => ({
    expo: {
      name: 'black_box',
      slug: 'black_box',
      extra: {
        API_URL: process.env.API_URL || 'http://172.16.52.84:3000/api',
      },
    },
  });
  