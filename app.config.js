import 'dotenv/config';
export default () => ({
    expo: {
      name: 'black_box',
      slug: 'black_box',
      extra: {
        API_URL: process.env.API_URL || "https://bblackbox-f3btf4c3g7fydhaf.westus-01.azurewebsites.net/api"
      },
    },
  });
  