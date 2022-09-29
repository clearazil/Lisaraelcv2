import dotenv from 'dotenv';

dotenv.config();

export default {
    discord: {
        token: String(process.env.DISCORD_TOKEN),
        appId: String(process.env.DISCORD_APPLICATION_ID),
    },
};
