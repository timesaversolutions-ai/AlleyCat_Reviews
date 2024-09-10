import 'dotenv/config';

export default {
  expo: {
    name: "PickleballFinder",
    // ... other existing expo config options
    extra: {
      googleApiKey: process.env.GOOGLE_DRIVE_API_KEY
    },
  },
};