import type {Client} from 'discord.js';
import config from '@config/config';

/**
 *
 */
export default class Discord {
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async login() {
        await this.client.login(config.discord.token);
    }

    public testFunction() {
        return 'This is a test function';
    }
}

