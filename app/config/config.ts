import dotenv from 'dotenv';

dotenv.config();

export default {
	discord: {
		token: process.env.DISCORD_TOKEN,
		appId: process.env.DISCORD_APPLICATION_ID,
	},
};
